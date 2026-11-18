# Security Specification & Payload-First TDD — D'Mayra Layer Cake

## 1. Data Invariants
1. **Default-Deny Catch-All**: Any unmatched path under `/databases/{database}/documents` is unconditionally denied.
2. **Verified Staff RBAC**: Staff privileges (`owner`, `manager`, `helper`) are never read from client payloads or unverified emails. Only the bootstrapped owner (`TVET1720@gmail.com` with `email_verified == true`) or active staff records in `/users/{uid}` carry staff permissions.
3. **Zero Self-Promotion**: Authenticated users creating `/users/{uid}` may ONLY create `role: 'customer'` (unless they match the bootstrapped verified owner email) and cannot mutate their own `role` or `active` flags.
4. **PII Isolation**: `/orders/{orderId}` contains buyer and recipient phone, email, and street address. It is readable ONLY by verified staff or the matching authenticated `buyerUid`. Guests track orders solely via `/orderTracking/{trackingToken}` (`allow list: if false`, `allow get` requires an unguessable 16+ char token) which strips all street addresses, emails, and full phone numbers.
5. **Helper Least Privilege (AC-07)**: Helpers may read orders, capacity, products, and shippingRates, and update order production/packing/shipping status, but are strictly blocked from editing `/settings`, `/users`, `/promos`, `/shippingRates`, `/products`, or reading `/auditLogs`.
6. **Temporal & ID Integrity**: All document IDs are strictly bounded (`<= 128` chars, `^[a-zA-Z0-9_-]+$`), string fields enforce explicit `.size()` bounds, arrays enforce `.size() <= MAX`, and `createdAt`/`updatedAt` timestamps must match `request.time`.

## 2. The "Dirty Dozen" Adversarial Payloads (Expected: PERMISSION_DENIED)
1. **Unverified Admin Email Spoof**: User with `{ email: "TVET1720@gmail.com", email_verified: false }` attempts to write `/settings/store`. -> **DENIED**.
2. **Self-Role Escalation on Create**: Customer writes `/users/{uid}` with `{ role: "owner", active: true }`. -> **DENIED**.
3. **Self-Role Escalation on Update**: Customer updates `/users/{uid}` changing `role` from `"customer"` to `"manager"`. -> **DENIED**.
4. **Helper Access to Settings (AC-07)**: Helper writes `/settings/store` to change shipping fee. -> **DENIED**.
5. **Helper Access to Audit Logs**: Helper lists `/auditLogs`. -> **DENIED**.
6. **Guest Order List Scraping**: Unauthenticated user calls `list` on `/orders` or `/orderTracking`. -> **DENIED**.
7. **Cross-Customer Order Read**: Customer A calls `get` on Customer B's `/orders/{orderId}`. -> **DENIED**.
8. **Shadow Field Injection on Order Create**: Order creation payload includes `{ isAdminOverride: true }` or extra shadow key. -> **DENIED** by `hasOnly`.
9. **ID Poisoning**: Attempt to read `/orderTracking/` with a 1.5KB junk document ID or short guessable ID (`"123"`). -> **DENIED** by `isValidId` + `tokenId.size() >= 16`.
10. **Negative Price / Invalid Status Order**: Order creation payload sets `pricing.totalSen = -500` or `status = "completed"` directly on creation. -> **DENIED**.
11. **Fake Review Pre-Approval**: Customer creates `/reviews/{id}` with `{ approved: true }`. -> **DENIED**.
12. **Client-Forged Timestamp**: Client creates `/customRequests/{id}` with `createdAt` set to a past date instead of `request.time`. -> **DENIED**.
