# D'Mayra Layer Cake Ordering System — Product Requirements Document (PRD)

Nov 18, 2026 · @Dd

## 1. Vision, goals and success metrics

D'Mayra LC needs a mobile-first web shop where a customer anywhere in Malaysia can order a layer cake, pick a dispatch or delivery date, pay with a local method, and track the order, while the bakery sees every order, capacity limit and payment in one place. The MVP is built in Google AI Studio (Build mode), stores data in Firebase (Firestore + Authentication), keeps its source in GitHub and ships from GitHub Actions.

**Assumptions used in this draft** (change any of them and the requirements below follow):

- D'Mayra LC is a home-based layer cake business with no shop, outlet or walk-in pick-up; the owner and 1 to 2 helpers bake in a home kitchen.
- Cakes can only be bought through this system. WhatsApp and social media are used to send customers to the site, not to take orders.
- Orders come in all year. Hari Raya, Chinese New Year, Deepavali, Christmas and school holidays are busier, but the system is built for steady daily orders, not only seasonal rushes.
- Fulfilment is courier postage anywhere in Malaysia (Pos Laju, Citylink or J&T), or self-delivery by the owner in Balik Pulau, Penang for a flat RM5.
- Prices are in MYR; the UI is Bahasa Malaysia first (the owner writes all product text in BM), with an English version added later.

### Goals

| # | Goal | Measure | Target (first 90 days live) |
| --- | --- | --- | --- |
| G1 | Replace chat-based order taking | Share of orders placed through the system | 70% |
| G2 | Cut order errors (wrong size, date, address, inscription) | Orders needing a correction call | under 5% |
| G3 | Get paid before baking | Orders with a deposit or full payment confirmed before production | 95% |
| G4 | Protect baking capacity | Days where confirmed orders exceed daily capacity | 0 |
| G5 | Fast, easy ordering on a phone | Median time from landing to paid order | under 5 minutes |
| G6 | Reduce admin time | Staff minutes spent per order on chat and manual tracking | down 50% |

### Non-goals for the MVP

In-person pick-up or a shop point of sale, multi-branch inventory, international shipping, a native iOS/Android app, loyalty points and marketplace listings. Some of these sit in the later phases (section 2).

## 2. Business context, personas and scope

The MVP serves three kinds of people and ships in three phases; everything customer-facing must work well on a mid-range Android phone over 4G, because that is how most customers will order.

### Personas

| Persona | Who | What they need | Main pain today |
| --- | --- | --- | --- |
| Customer sending a gift | Friend or relative anywhere in Malaysia buying a cake for someone in another town or state | See cake price and shipping cost upfront, choose a courier, pay online, track the parcel | No way to know the shipping cost or arrival time before ordering |
| Customer in Balik Pulau | Local buyer | Order, see the RM5 delivery fee, choose a delivery day | Waiting for chat replies to arrange delivery |
| Customer buying for an event or as corporate gifts | One buyer, several cakes or several addresses | Repeat orders, receipts, later: several recipients | Repeating the same details for each order |
| Owner (home baker and admin) | Runs the business from home | Daily baking list, packing list, capacity control, payment status, tracking number entry | Orders and addresses scattered across chats |
| Helper / packer | Family or part-time helper | Clear list of what to bake, decorate and pack today, with address labels | Misread messages, wrong parcel |
| Courier (external, not a system user) | Pos Laju, Citylink, J&T | Correct address, phone, parcel weight | Incomplete addresses |

### Scope by phase

| Phase | Included | Excluded until later |
| --- | --- | --- |
| MVP (Phase 1) | Catalogue, cake configurator, cart and checkout, dispatch/delivery date picker with daily capacity, courier shipping (Pos Laju, Citylink, J&T) with a flat fee by region, Balik Pulau self-delivery at RM5, online payment (FPX, DuitNow QR, card), order tracking with courier tracking number, admin (orders, production list, packing list, capacity, shipping rates), email notices, EN/BM | Loyalty, subscriptions, native apps, in-person pick-up |
| Phase 2 | Customer accounts with saved addresses and reorder, discount codes, reviews with photos, damage-claim form, courier booking and live rates through an aggregator or courier API, receipt/e-invoice, basic sales analytics, WhatsApp Business messages | Marketplace sync |
| Phase 3 | Several recipients in one order, corporate accounts and quotations, loyalty points, gift cards, Instagram/Meta catalogue sync | International shipping |

### Key constraints

- Cakes are made to order in a home kitchen, so every order has a lead time (default 3 days; owner can change it per product).
- Daily capacity is limited by baking hours, so the system counts cake slots per day instead of stock units.
- Parcels should not sit in a courier network over a weekend: courier orders can only be dispatched on days the owner enables (Monday to Wednesday).
- Balik Pulau self-delivery is the only non-courier option: flat RM5, on delivery days and to postcodes the owner sets.
- The system must never confirm an order that breaks capacity, a dispatch day or a blocked date (public holiday, owner away, no baking).

## 3. Functional requirements

The system has 3 surfaces: a public storefront, a signed-in customer area, and an admin back-office. Priority uses MoSCoW (M = must for MVP, S = should, C = could).

### 3.1 Storefront and cake configurator

| ID | Requirement | Pri |
| --- | --- | --- |
| FR-01 | Home page shows featured cakes, festive collection banner, lead-time notice, and a sticky "Order now" button | M |
| FR-02 | Catalogue lists cakes with photo, starting price (RM), flavour tags, and filters by flavour, occasion, size and price | M |
| FR-03 | Product page offers: format (Whole or Loaf, each with its own price), quantity (1 to 10), and a notes box (for example "cut into 4"); the Budget Combo lets the customer pick 5 of the 8 flavours for one set price (RM100, several sets allowed); each product shows flavour, ingredients, and whether it uses pure butter or margarine | M |
| FR-04 | Price recalculates live from the options chosen; the total shown on the page equals the total charged | M |
| FR-05 | Optional extras not on the current form (for example greeting card or gift box), only if the owner wants them | S |
| FR-06 | Allergen and ingredient panel on each product (nuts, gluten, dairy, egg, sesame) | M |
| FR-07 | Request form for cakes not in the catalogue (Whole cakes only), answered by the owner with a quote | S |
| FR-08 | Bilingual toggle EN / BM, remembered in the browser | S |

### 3.2 Cart, scheduling and checkout

| ID | Requirement | Pri |
| --- | --- | --- |
| FR-10 | Cart holds several cakes, each with its own options and inscription; all cakes in one order share one recipient, one address and one dispatch/delivery date | M |
| FR-11 | Date picker greys out dates before the lead time, days the owner does not dispatch or deliver, blocked dates, and days at capacity | M |
| FR-12 | For courier orders the page shows the estimated arrival window by destination (for example West Malaysia 1 to 3 working days; Sabah and Sarawak longer; owner-set) | M |
| FR-13 | Delivery choice: courier postage (Pos Laju, Citylink or J&T) or Balik Pulau self-delivery, offered only when the postcode is on the Balik Pulau list; no in-person pick-up | M |
| FR-14 | Shipping fee: courier postage is a flat rate set by the owner (separate rates for West Malaysia, Sabah and Sarawak allowed), the same for all three couriers; Balik Pulau self-delivery is a flat RM5; optional free-shipping threshold | M |
| FR-15 | Guest checkout with buyer name, phone (+60 format check) and email; sign-in optional | M |
| FR-16 | Promo code field with admin-defined rules (percent or RM, minimum spend, expiry) | S |
| FR-17 | Order summary with total, amount due now, and terms (cancellation, damage and delay, allergen notice) accepted by tick-box | M |
| FR-18 | Customer picks the courier with its fee and arrival window shown; owner can switch a courier off for a destination | M |
| FR-19 | Recipient details can differ from the buyer (gift): name, phone, address, state, postcode, validated for Malaysian format; notice that the cake is defrosted before dispatch and keeps about 5 days at room temperature | M |

### 3.3 Payment

| ID | Requirement | Pri |
| --- | --- | --- |
| FR-20 | Pay online by FPX online banking, DuitNow QR and credit/debit card through one Malaysian-supported gateway | M |
| FR-21 | Full payment at checkout by default; an optional deposit (admin-set, off by default) may apply to Balik Pulau self-delivery orders only, with the balance due before delivery | M |
| FR-22 | Order moves to Confirmed only after a verified gateway webhook, never from the browser redirect alone | M |
| FR-23 | Unpaid orders auto-expire after 30 minutes and release the capacity slot | M |
| FR-24 | Manual bank transfer with receipt upload as fallback, approved by admin | S |
| FR-25 | Refund or partial refund recorded by admin with reason | S |
| FR-26 | Receipt PDF emailed after payment (e-invoice fields added in Phase 2 if the business reaches the LHDN threshold) | S |

### 3.4 Order tracking and customer area

| ID | Requirement | Pri |
| --- | --- | --- |
| FR-30 | Order page by link and order number with status: Pending payment, Confirmed, In production, Packed, Shipped (courier name, tracking number and tracking link) or Out for delivery (Balik Pulau), Delivered, Completed, Cancelled | M |
| FR-31 | Change request until 48 hours before the dispatch date, with owner approval | S |
| FR-32 | Signed-in customers see order history, saved addresses and a one-tap reorder | S |
| FR-33 | Post-order review with photo, shown after admin moderation | C |
| FR-34 | Damage or delay is reported only through the order page, by updating the order and uploading photos of the damage; the owner replaces, refunds or rejects per the terms | S |

### 3.5 Admin back-office

| ID | Requirement | Pri |
| --- | --- | --- |
| FR-40 | Admin sign-in with roles: Owner, Manager (optional), Helper; each sees only what the role allows | M |
| FR-41 | Order list with filters (date, status, courier or self-delivery, payment) and a detail view with the customer's reference photo and inscription | M |
| FR-42 | Production list for a chosen day: cakes to bake grouped by flavour and size, decoration notes, printable | M |
| FR-43 | Capacity calendar: cakes per day, dispatch days, Balik Pulau delivery days, blocked dates, busy-period overrides, and seasonal pre-order campaigns with fixed posting dates and a close date (like the Aidiladha 2026 form) | M |
| FR-44 | Catalogue manager: create and edit products, options, prices, photos, allergens, packed weight per size, availability toggle | M |
| FR-45 | Shipping settings: courier flat rates by region, Balik Pulau postcodes and the RM5 fee, lead times, terms, deposit rule, all editable without code | M |
| FR-46 | Status buttons; entering the courier tracking number marks the order Shipped and notifies the customer | M |
| FR-47 | Packing and dispatch list per dispatch day: orders to pack, recipient address label (printable), chosen courier, parcel weight | M |
| FR-48 | Dashboard: orders and revenue per day/week, top cakes, payment status, next 7 days load; customer list export to CSV | S |
| FR-49 | Audit log of price, capacity, shipping-rate and status changes (who, when, old value, new value) | S |

### 3.6 Notifications

| ID | Requirement | Pri |
| --- | --- | --- |
| FR-50 | Email to customer: order received, payment confirmed, packed, shipped with tracking number, delivered | M |
| FR-51 | Admin alert on new paid order by email and WhatsApp click-to-chat link; WhatsApp Business API messages are Phase 2 | S |
| FR-52 | Reminder to the recipient's buyer on dispatch day; feedback request 2 days after delivery | S |

## 4. User flows, UX and business rules

A customer should reach a paid order in 6 screens, and the bakery should never have to message a customer to ask what they meant.

### Customer journey (happy path)

1. Landing or catalogue: browse, filter, open a cake.
2. Configurator: choose size, flavour, layers, filling, inscription, photo; price updates live.
3. Recipient and delivery: enter recipient name, phone, address, state and postcode; the system shows courier options (Pos Laju, Citylink, J&T) with fee and arrival window, or Balik Pulau self-delivery at RM5 when the postcode qualifies; then pick the dispatch or delivery date.
4. Cart review: edit items, add promo code, see shipping fee and total.
5. Pay: choose FPX, DuitNow QR or card.
6. Confirmation: order number, status link and receipt by email; a second email follows with the courier tracking number once the parcel is dispatched.

### Screen inventory

| Surface | Screens |
| --- | --- |
| Storefront | Home, Catalogue, Product + configurator, Cart, Checkout (recipient, courier, date), Payment result, Order tracking, About / contact / FAQ with shipping and refund policy, Terms and privacy |
| Customer area (Phase 2 for full history) | Sign in, My orders, Saved addresses, Reorder |
| Admin | Dashboard, Orders, Order detail, Production list, Packing and dispatch list, Capacity calendar, Catalogue manager, Settings (shipping rates, Balik Pulau delivery, terms), Users and roles, Audit log |

### Business rules the system must enforce

| Rule | Behaviour |
| --- | --- |
| Lead time | Earliest date = today + product lead time (default 3 days), moved forward to the next enabled dispatch or delivery day; owner can override per product |
| Capacity | Each day has a cake-slot limit; each cake uses slots by format (owner sets the weight, for example Loaf = 0.25 and Whole = 1); orders above the limit are refused at checkout |
| Dispatch days | Courier orders are dispatched only on days the owner enables (Monday to Wednesday); Balik Pulau self-delivery uses its own delivery days; there are no time slots |
| Slot hold | When a customer starts payment, the capacity is held for 30 minutes, then released if unpaid |
| Payment | Full payment at checkout; an optional deposit applies only to Balik Pulau orders when the owner switches it on |
| Shipping fee | Courier: one flat rate set by the owner (West Malaysia, Sabah and Sarawak can differ); Balik Pulau: flat RM5; always calculated on the server |
| Packaging and transit | The owner defrosts the cake before dispatch; it travels at room temperature in a sturdy box and keeps about 5 days at room temperature, which is shown on the product page, at checkout and in the emails |
| Cancellation | A cancelled order forfeits the amount paid (no refund); the terms say so before payment, are editable, and a copy is stored with each order |
| Damage and delay | Reported only through the order page by updating the order and uploading photos of the damage; the owner replaces, refunds or rejects per the terms; courier delays after dispatch are stated in the terms |
| Address check | State and postcode must match; addresses no courier serves are refused with a clear message |
| Price integrity | Price is always recalculated on the server from the catalogue and shipping rates; the browser total is only a preview |
| Inscription | Customer notes: max 200 characters, plain text, shown on the production and packing lists |
| Allergens | Allergen panel and a notice that the home kitchen handles nuts, dairy, egg and gluten shown at checkout |

### Catalogue seed data (from the current order form)

The catalogue below is taken from the [Aidiladha 2026 order form](https://docs.google.com/forms/d/e/1FAIpQLSf_2M3FggM67r13HHunhYBToeTdhbsL3LuMWYGDBpNsP82qzw/viewform). Whole prices are as printed on that form; loaf prices are RM5 higher than the form and the Budget Combo is RM100 per set, as the owner instructed. Please confirm these before launch. The cakes are fixed products sold as Whole or Loaf, not a build-your-own cake, so the product page needs format, quantity and notes, not a cake designer.

| Range | Cake | Flavour | Whole (RM) | Loaf (RM) |
| --- | --- | --- | --- | --- |
| Classic (pure butter) | Masam Manis | Jam and hawflakes | 160 | 45 |
| Classic (pure butter) | Sisik Ikan | Horlicks and hawflakes | 170 | 45 |
| Cadbury (pure butter) | Cadbury Original | Cadbury and Horlicks | 180 | 45 |
| Cadbury (pure butter) | Cadbury Cheese | Milk, cheese and Cadbury | 190 | 50 |
| Trendy (pure butter) | Cranberry Cheese | Strawberry, cranberry, cheese, red velvet | 260 | 60 |
| Trendy (pure butter) | Sicily | Fruity, nutty, chocolate | 260 | 60 |
| Trendy (pure butter) | Chocoful Cheezy | Chocolate and cheese | 260 | 60 |
| Trendy (pure butter) | Espresso Cheese | Espresso, chocolate, cheese | 240 | 55 |
| Trendy (pure butter) | Chocolate Cheese Almond | Chocolate, almond nibs, cheese | 160 | 45 |
| Trendy (pure butter) | Durian Cheese | Udang Merah or Musang King durian, cheese | 350 | 70 |
| Trendy (pure butter) | Durilicious (no cheese) | Udang Merah or Musang King durian | 350 | 70 |

**Budget Combo (margarine base):** one set at RM100 containing 5 Whole-size cakes chosen from 8 (several sets can be bought in one order): Coffee Cheese, Crush CremeO Cheese, Strawberry Blueberry Cheese, Strawberry Masam Manis, Chocolate Cadbury, Chocolate Cheese, Mango Cheese, Red Velvet.

**Rules carried over from the form:** the durian variety depends on availability; cakes not in the catalogue are accepted as Whole only through a request; a notes box lets the customer ask for things like cutting a Whole cake into 4; one order has one address, so a customer sending to several addresses places a separate order for each; seasonal campaigns have fixed posting dates and a close date.

### UX principles

- Mobile first: 360 px wide layout, thumb-reachable buttons, images under 200 KB, first view under 3 seconds on 4G.
- Prices always in RM with the amount due now shown in the same colour and size as the total.
- Plain words in EN and BM; no step needs the customer to leave the site except the bank page for FPX.
- Accessible: contrast ratio 4.5:1 or better, labels on every field, keyboard operable admin.

## 5. Non-functional requirements and Malaysia compliance

The system must be fast on mobile, safe with customer data, and consistent with Malaysian food, privacy and tax rules. The legal items below are a checklist for the owner to confirm with an accountant or lawyer; they are not legal advice.

### 5.1 Non-functional requirements

| Area | Requirement |
| --- | --- |
| Performance | Largest Contentful Paint under 2.5 s on 4G; checkout API responses under 1 s at the 95th percentile |
| Availability | 99.5% monthly for the storefront (Firebase Hosting / Cloud Run SLAs apply); planned changes outside 10am to 10pm Malaysia time on festive weeks |
| Scale | Design for 500 orders per day and 5,000 visitors per day at Raya or Christmas peaks without code change |
| Security | HTTPS only; Firebase Auth for admins with email + password and optional 2-step verification; role checks enforced by Firestore Security Rules and server code; no payment card data stored by D'Mayra |
| Privacy | Collect only name, phone, email, address and order details; consent tick-box and privacy notice; customer data deletion on request |
| Data safety | Daily Firestore export to a Cloud Storage bucket, kept 30 days; restore tested once before launch |
| Browser support | Last 2 versions of Chrome, Safari, Edge, Samsung Internet; iOS 15+ and Android 9+ |
| Accessibility | WCAG 2.1 AA for storefront |
| Localisation | Currency MYR, time zone Asia/Kuala\_Lumpur, phone format +60, dates in dd/mm/yyyy, EN and BM text kept in a translation file, not in the code |
| Observability | Error logging, payment webhook log, and an alert to the owner when a webhook fails or an order is stuck in Pending payment for over 1 hour |
| Maintainability | Source in GitHub with pull-request review, environment variables for secrets, written runbook (section 8) |

### 5.2 Malaysia compliance checklist

| Topic | What it means for this system | Owner to confirm |
| --- | --- | --- |
| Personal data (PDPA 2010, as amended) | Show a privacy notice in EN and BM; record consent; recipient details are personal data too; keep a breach-response process; check whether a data protection officer must be named | Owner / lawyer |
| Halal | Do not show a "halal" label unless the kitchen or product holds a valid certificate (JAKIM or the state religious authority); "no pork, no lard" is a separate claim and must be true | Owner |
| Home-based food business | Check what the local council (Penang Island or Seberang Perai) and the district Health Office require of a home-based food seller: business licence, food-handler training, typhoid vaccination, and label rules under the Food Act 1983 and Food Regulations 1985; the allergen panel in FR-06 supports this | Owner |
| Business registration | SSM registration (or the form the payment gateway accepts for a home business) shown in the footer with business name and contact | Owner |
| Shipping food by courier | Confirm that Pos Laju, Citylink and J&T each accept cakes, including to Sabah and Sarawak, and check their packing rules and compensation limits; add a best-before note based on the 5-day room-temperature shelf life | Owner |
| Sales and service tax | Confirm whether the business is above any SST registration threshold; if registered, prices show whether tax is included | Accountant |
| E-invoice (LHDN MyInvois) | Confirm whether annual turnover requires e-invoicing; the order data model keeps buyer TIN and address fields so Phase 2 can integrate | Accountant |
| Consumer protection | Terms state price, shipping, cancellation, damage and refund rules clearly before payment; a copy is stored with each order | Owner |
| Payments | Use a gateway licensed in Malaysia that supports FPX and DuitNow QR and accepts a home-based business; keep settlement reports for bookkeeping | Owner |

### 5.3 Payment gateway options to shortlist

| Option | Fit for D'Mayra | Note |
| --- | --- | --- |
| Billplz or ToyyibPay | Low-cost FPX for small sellers, simple API | Check card and DuitNow QR support at signup |
| Stripe Malaysia | Strong developer tools, cards, FPX, DuitNow QR | Needs a verified business account; webhooks run on Cloud Functions |
| Other local aggregators (e.g. senangPay, Revenue Monster, iPay88) | Wider wallet coverage (Touch 'n Go, GrabPay) | Compare fees and onboarding time |

Decision needed from the owner: pick one gateway before Sprint 3 (section 9); all requirements above are written to work with any of them.

## 6. Architecture, data model and security

The web app runs in the browser and talks to Firebase; anything that sets a price, holds capacity or marks an order paid runs in Cloud Functions, where a customer cannot change it.

*(Diagram: browser app and admin on Firebase Hosting or Cloud Run; Firebase Auth, Firestore, Storage and Cloud Functions; payment gateway and email. Cloud Functions set every price and payment status. See the live doc for the drawing.)*

Google AI Studio generates the web app and the Firestore/Auth wiring. Cloud Functions, the payment gateway and the email service are added in the GitHub repository after the first export, using the Firebase CLI (Cloud Functions need the pay-as-you-go Blaze plan; set a budget alert at RM50).

### 6.1 Tech stack

| Layer | Choice | Reason |
| --- | --- | --- |
| Front end | React + TypeScript + Tailwind (AI Studio Build mode default), PWA manifest | Fast on mobile; installable on a home screen |
| Auth | Firebase Authentication: email + password for staff, Google sign-in or email link for customers | Built into the AI Studio integration |
| Database | Cloud Firestore, region asia-southeast1 (Singapore) | Closest region to Penang |
| Files | Cloud Storage for Firebase | Reference photos and product images |
| Server logic | Cloud Functions (Node.js, TypeScript) | Pricing, capacity, webhooks, notices |
| Hosting | Firebase Hosting (static app) with Cloud Run as the AI Studio publish option | See section 8 |
| Source and CI/CD | GitHub + GitHub Actions | Reviewable history and automatic deploys |

### 6.2 Firestore data model

Money is stored as whole sen (RM 85.00 = 8500) to avoid rounding errors. Dates are stored as UTC timestamps and shown in Asia/Kuala\_Lumpur.

| Collection | Key fields | Written by |
| --- | --- | --- |
| products/{productId} | name {en, ms}, description, category, images\[\], active, leadTimeDays, allergens\[\], range (budget, classic, cadbury, trendy), baseFat (butter or margarine), formats {whole: price, loaf: price} each with capacityWeight and packedWeightGrams, comboRule {pick: 5, from: flavour list, price} | Staff (owner, manager) |
| orders/{orderId} | orderNo, trackingToken, buyer {name, phone, email, uid?}, recipient {name, phone}, items\[\] {productId, format, quantity, combo picks, notes, unitPrice}, fulfilment {method: courier or self\_delivery, courier, address, state, postcode, dispatchDate, parcelWeightGrams, trackingNo, trackingUrl}, pricing {subtotal, shippingFee, discount, tax, total, amountDueNow, balanceDue}, payment {status, method, gatewayRef, paidAt}, status, termsVersion, createdAt, expiresAt | Cloud Functions only |
| orders/{orderId}/history/{id} | status, changedBy, note, timestamp | Cloud Functions only |
| capacity/{yyyy-mm-dd} | limit, used, dispatchEnabled, selfDeliveryEnabled, blocked, note | Staff set limits; Cloud Functions change used |
| shippingRates/{id} | courier (pos\_laju, citylink, jnt), destination (West Malaysia, Sabah, Sarawak or state), flat fee, estimated days, active | Owner, manager |
| promos/{code} | type, value, minSpend, expiresAt, usesLeft, active | Owner, manager |
| settings/store | selfDelivery {fee: 500 sen, postcodes\[\], days\[\], depositPercent}, dispatchDays\[\], termsVersion, termsText {en, ms}, contact details, holidays\[\] | Owner |
| users/{uid} | displayName, role (owner, manager, helper), active | Owner via function |
| customers/{uid} | saved addresses, phone, marketing consent | The customer |
| payments/{id} | gateway event payload, signature check result, order reference | Cloud Functions only |
| auditLogs/{id} | actor, action, before, after, timestamp | Cloud Functions only |
| reviews/{id} | orderId, rating, text, photo, approved | Customer creates; staff approve |

### 6.3 Cloud Functions

| Function | Trigger | Job |
| --- | --- | --- |
| createOrder | Callable | Validate cart, recompute price and shipping fee from products and shippingRates, check lead time and capacity inside a transaction, hold the slot, return the order and payment link |
| paymentWebhook | HTTPS | Verify the gateway signature, mark payment paid or failed, confirm the order, write to payments |
| expireUnpaidOrders | Scheduled, every 5 minutes | Cancel orders unpaid after 30 minutes and release capacity |
| getOrderByToken | Callable | Return a safe view of one order to a guest holding its tracking token |
| onOrderStatusChange | Firestore trigger | Write history and audit rows; send customer email |
| setUserRole | Callable, owner only | Set the role custom claim and the users document |
| dailyBackup | Scheduled, 03:00 Malaysia time | Export Firestore to a Cloud Storage bucket; delete exports older than 30 days |

### 6.4 Security rules (starting point)

Guests never read the orders collection directly; they use getOrderByToken. AI Studio generates first rules automatically, but the owner must review and replace them with the rules below before real orders are taken.

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    function signedIn() { return request.auth != null; }
    function role() { return signedIn() ? request.auth.token.role : null; }
    function isStaff() { return role() in ['owner','manager','helper']; }
    function canManage() { return role() in ['owner','manager']; }

    match /products/{id} {
      allow read: if resource.data.active == true || isStaff();
      allow write: if canManage();
    }
    match /shippingRates/{id}    { allow read: if true; allow write: if canManage(); }
    match /settings/{id} { allow read: if true; allow write: if role() == 'owner'; }
    match /capacity/{day} { allow read: if true; allow write: if canManage(); }
    match /promos/{id}   { allow read, write: if canManage(); }
    match /orders/{id} {
      allow read: if isStaff()
        || (signedIn() && resource.data.customer.uid == request.auth.uid);
      allow write: if false;
      match /history/{h} { allow read: if isStaff(); allow write: if false; }
    }
    match /customers/{uid} { allow read, write: if signedIn() && request.auth.uid == uid; }
    match /users/{uid}   { allow read: if signedIn() && (request.auth.uid == uid || canManage()); allow write: if false; }
    match /reviews/{id} { allow read: if resource.data.approved == true || isStaff(); allow create: if signedIn(); allow update: if canManage(); }
    match /payments/{id}  { allow read, write: if false; }
    match /auditLogs/{id} { allow read: if role() == 'owner'; allow write: if false; }
  }
}
```

Storage rules follow the same idea: customers may upload one image of up to 5 MB under their own order path, product images are public read and staff write, and nothing else is writable from the browser.

## 7. Google AI Studio build plan

Build the app in 6 prompts, testing after each one, because AI Studio follows specific instructions far better than vague ones. Per [Firebase's AI Studio guide](https://firebase.google.com/docs/ai-assistance/ai-studio-integration), Build mode can add Cloud Firestore and Firebase Authentication to a web app, the generated files include firestore.rules, and the integration supports web apps only (not Android). Check the current behaviour in AI Studio before starting, since this feature is new and changes often.

### Setup (once)

1. Open aistudio.google.com with the Google account that will own the bakery's Firebase project, choose Build mode, and select React.
2. Create the app with Prompt 1 below. When AI Studio shows the Enable Firebase card, accept it, and use the settings icon to pick a dedicated Google Cloud project named dmayra-lc-prod if you do not want a new one created automatically.
3. Create a second Firebase project, dmayra-lc-staging, for testing payments and rules without touching real data.
4. After each prompt, test in the preview, then use the GitHub export in AI Studio so every step is a commit (section 8).

### Prompt 1: shell, theme and catalogue

```text
Build a mobile-first web app called "D'Mayra Layer Cake", a home-based layer cake business in Penang, Malaysia that sells online only and delivers by courier across Malaysia or by the owner in Balik Pulau.
Use React + TypeScript + Tailwind. Language: Bahasa Malaysia as the default, with a translations file ready for an English version later. Currency: MYR (RM), amounts stored as integer sen. Time zone: Asia/Kuala_Lumpur.
Pages: Home (hero, featured cakes, notice of the next dispatch dates), Catalogue (grouped by range: Budget Combo, Classic, Cadbury, Trendy), Product page, Cart, Checkout, Order tracking, About/Contact/FAQ with shipping and refund policy, Terms, Privacy.
Style: warm, premium bakery look; cream and deep berry colours; large cake photos; 4.5:1 contrast; works from 360 px width.
Enable Firebase (Firestore + Authentication). Create a products collection and seed it with the catalogue table in section 4 of the PRD: each product has a range, flavour description, butter or margarine base, and a price for Whole and a price for Loaf. Seed the Budget Combo as one product at RM100 per set of Whole-size cakes, where the customer picks exactly 5 of 8 flavours and may buy several sets.
```

### Prompt 2: product options and live price

```text
On the Product page add: a Whole or Loaf selector showing each price, a quantity stepper (1 to 10), a notes box (max 200 characters, for example "cut into 4"), and an ingredient and allergen panel. For the Budget Combo, show 8 flavours as tick-boxes and require exactly 5 to be chosen. Add to Cart stores the format, quantity, picks and notes. Add a "Cake not listed?" request form (Whole cakes only) that sends the owner a message instead of creating an order.
The displayed price is only a preview: write a pure function calculatePrice(product, selection) in its own file so it can be reused in Cloud Functions and unit tested.
```

### Prompt 3: date, slot, delivery and checkout

```text
Build the Cart and Checkout. There is no shop and no pick-up: every order is either (a) courier postage by Pos Laju, Citylink or J&T anywhere in Malaysia, or (b) self-delivery by the owner in Balik Pulau, Penang for a flat RM5.
Checkout collects the buyer's name, phone (+60) and email, and the recipient's name, phone, address, state and postcode (the recipient can differ from the buyer).
Read the shippingRates collection and settings/store.selfDelivery. If the postcode is on the Balik Pulau list, offer self-delivery at RM5. Otherwise show the courier options with the flat fee for the destination and estimated arrival days, and let the customer choose one. Refuse addresses no courier serves.
Read capacity/{yyyy-mm-dd} and settings: grey out dates before the lead time, days when the owner does not dispatch (Monday to Wednesday for couriers), blocked dates and days at capacity. For self-delivery use the owner's Balik Pulau delivery days. There are no time slots.
Show subtotal, shipping fee, promo discount, total, and a notice that the cake is defrosted before dispatch and keeps about 5 days at room temperature. Payment is the full amount by default. Require the terms tick-box. Create the order through createOrder(cart) with status "pending_payment"; the browser must never write to the orders collection directly.
```

### Prompt 4: order tracking and notifications

```text
Build the Order tracking page opened by a link containing an order number and tracking token. It shows the status timeline: Pending payment, Confirmed, In production, Packed, Shipped or Out for delivery (Balik Pulau), Delivered, Completed, Cancelled. For shipped orders show the courier name, the tracking number and a link to the courier's tracking page. Show items, inscription, dispatch or delivery date, recipient, and the amount paid. Add a WhatsApp share button and a "Report a problem" form with photo upload that is the only way to claim for damage or delay. Fetch the order through a function getOrderByToken, not by reading Firestore directly.
```

### Prompt 5: admin back-office

```text
Build an Admin area at /admin protected by Firebase Auth and a role claim (owner, manager, helper).
Screens: Dashboard (orders and revenue per day, next 7 days load), Orders (filter by date, status, courier or self-delivery, payment; detail view with reference photo and inscription; status buttons; a field to enter the courier tracking number which marks the order Shipped), Production list (choose a day, group cakes by flavour and size, printable), Packing and dispatch list (per dispatch day: orders to pack, printable recipient address labels, courier, parcel weight), Capacity calendar (cakes per day, dispatch days, Balik Pulau delivery days, blocked dates), Catalogue manager (products, options, photos, allergens, packed weight per size, active toggle), Settings (courier flat rates by region, Balik Pulau postcodes and the RM5 fee, terms text in EN and BM, optional deposit), Users and roles (owner only), Audit log.
Helpers see only the Production list, Packing and dispatch list and Orders.
```

### Prompt 6: security and quality pass

```text
Review the whole app for security and quality. Replace the generated firestore.rules with these rules (paste section 6.4). Add storage.rules: customers may upload one image up to 5 MB under their own order path; products images are public read, staff write. Remove any API keys from client code that should be secret. Add form validation, loading and error states, empty states, an offline notice, and meta tags for sharing on WhatsApp. List anything that still writes to orders, payments or capacity from the browser.
```

After Prompt 6, move to the GitHub repository for what AI Studio does not generate: Cloud Functions (createOrder, paymentWebhook and the rest of section 6.3), gateway integration, email sending and the backup job. Those can be written by prompting AI Studio again, or by Claude Code or Gemini in your editor, then tested against the staging project.

## 8. GitHub, CI/CD and deployment

GitHub holds the source and runs the build; the live site runs on Firebase. GitHub Pages can only serve static files, so it cannot run checkout, payment webhooks or the order database, and is not used for production. AI Studio can export a project to GitHub or deploy it straight to Cloud Run; both are described in the [Firebase and AI Studio guide](https://firebase.google.com/docs/ai-assistance/ai-studio-integration) and the [launch post](https://firebase.blog/posts/2026/03/announcing-ai-studio-integration). This PRD uses the GitHub route because it gives reviewed, repeatable releases.

### 8.1 Environments

| Environment | Firebase project | Branch / trigger | Purpose |
| --- | --- | --- | --- |
| Local | Firebase emulators | Developer laptop | Build and test without cost or real data |
| Preview | dmayra-lc-staging, preview channel | Every pull request | Review a change at its own temporary URL |
| Staging | dmayra-lc-staging | Merge to develop | Test gateway sandbox payments and rules |
| Production | dmayra-lc-prod | Merge to main, owner approval | Real customers and real money |

### 8.2 Repository layout

```text
dmayra-lc/
  apps/web/            React storefront + admin (exported from AI Studio)
  functions/           Cloud Functions (TypeScript)
  packages/pricing/    calculatePrice shared by web and functions
  firestore.rules  firestore.indexes.json  storage.rules  firebase.json
  docs/                this PRD, runbook, terms text
  .github/workflows/   ci.yml  deploy.yml
  .env.example         names of variables only, never values
```

### 8.3 Step-by-step

1. In GitHub create a private repository dmayra-lc under the bakery's account; protect main (pull request required, 1 review, CI must pass).
2. In AI Studio use the GitHub export, choose that repository, and keep develop as the working branch.
3. Install the Firebase CLI locally and run `firebase init hosting:github`; it creates a service account and stores it as a repository secret.
4. Add repository secrets: FIREBASE\_SERVICE\_ACCOUNT\_STAGING and FIREBASE\_SERVICE\_ACCOUNT\_PROD. Add a GitHub Environment named production with the owner as required reviewer.
5. Store gateway keys and the webhook secret as Firebase function secrets (`firebase functions:secrets:set GATEWAY_SECRET`), not in GitHub files or in the web app. Firebase web config values are public identifiers and may sit in the client.
6. Add the workflow below, open a pull request, check the preview URL, merge to develop, test payments on staging, then merge develop to main.
7. Connect the custom domain in Firebase Hosting, enable HTTPS, and register the payment webhook URL with the gateway.

### 8.4 Workflow (deploy.yml)

```text
name: deploy
on:
  pull_request:
  push:
    branches: [develop, main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint && npm test && npm run build
  preview:
    if: github.event_name == 'pull_request'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci && npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_STAGING }}
          projectId: dmayra-lc-staging
  deploy-prod:
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    needs: test
    environment: production
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci && npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_PROD }}
          projectId: dmayra-lc-prod
          channelId: live
```

This file deploys the web app. A second job (same pattern, run with firebase-tools and the production service account) deploys functions, firestore.rules, firestore.indexes.json and storage.rules; it is added in Sprint 3. A staging job for the develop branch follows the same shape with the staging project.

### 8.5 Release, rollback and recovery

| Situation | Action |
| --- | --- |
| Normal release | Merge develop to main, owner approves the production environment, check the live site and one test order in the sandbox before opening to customers |
| Bad release | In the Firebase console open Hosting, choose the previous release and roll back (under 2 minutes); then revert the commit in GitHub |
| Bad rules or data change | Redeploy the last good firestore.rules from Git; restore Firestore from the latest daily export |
| Payment webhook failing | Alert fires; check the payments collection and gateway dashboard, replay events from the gateway |
| Festive freeze | No deployments from 3 days before a festival peak unless fixing a defect; owner decides |

## 9. Roadmap, quality, risks, cost and open questions

The MVP can be live by mid-February 2027 in 5 two-to-three-week sprints, with a soft launch to a limited menu so the first Ramadan and Hari Raya pre-order season tests the system without risking the whole business. Confirm festival dates against the official 2027 calendar before fixing the plan.

*(Diagram: Phase 0 Prepare 18-27 Nov 2026; Sprint 1 30 Nov-11 Dec; Sprint 2 14-25 Dec; Sprint 3 28 Dec-15 Jan; Gate A sandbox payment and webhook pass; Sprint 4 18-29 Jan; Sprint 5 1-12 Feb 2027; Gate B UAT sign-off; soft launch from 15 Feb 2027.)*

### 9.1 Acceptance criteria for the MVP

| ID | Given / when / then |
| --- | --- |
| AC-01 | Given a cake with a 3-day lead time and courier dispatch on Monday to Wednesday, when a customer opens the date picker on Wednesday 18 Nov, then the earliest selectable courier date is Monday 23 Nov |
| AC-02 | Given a day with capacity 10 and 9 used, when two customers pay for 1 cake each at once, then exactly one order is confirmed and the other sees "date no longer available" |
| AC-03 | Given a customer edits the price or shipping fee in the browser, when the order is created, then the stored total equals the server-calculated total |
| AC-04 | Given a customer is redirected back from the bank page, when the gateway webhook has not arrived, then the order stays Pending payment |
| AC-05 | Given an order unpaid for 30 minutes, then it is cancelled and its capacity is released |
| AC-06 | Given a guest without the tracking token, when they request an order, then no data is returned |
| AC-07 | Given a helper account, when it opens Settings or Users, then access is refused by the rules as well as the screen |
| AC-08 | Given a postcode on the Balik Pulau list, then self-delivery at RM5 is offered; given any other postcode, then self-delivery is not offered and courier options with fees are shown |
| AC-09 | Given an address no courier serves, then checkout refuses with a clear message |
| AC-10 | Given the owner enters a tracking number, then the order becomes Shipped and the customer email with courier name and tracking link arrives within 2 minutes |
| AC-11 | Given a paid order, then the customer email and the admin alert arrive within 2 minutes |
| AC-12 | Given the storefront on a mid-range Android phone over 4G, then the product page loads (LCP) in under 2.5 s |

### 9.2 Test plan

- Unit tests for calculatePrice, lead-time and capacity logic (run in CI on every pull request).
- Firestore and Storage rules tests with the Firebase emulator: each role against each collection, allowed and denied.
- End-to-end tests (Playwright) for the 6-screen happy path, a failed payment, an expired order and an out-of-zone address.
- Gateway sandbox tests on staging: success, failure, user cancel, duplicate webhook, late webhook.
- Load test at 5 times expected peak on the checkout function; restore test of a daily backup.
- User acceptance test with the owner, one baker and 5 real customers on staging, using the checklist in docs/uat.md.

### 9.3 Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Cake damaged or spoiled in transit | Refunds, bad reviews | Box packaging tested with each courier before launch, dispatch Monday to Wednesday, damage reported only through the order page with photos, clear terms |
| Courier delays, especially to Sabah and Sarawak, beyond the 5-day room-temperature shelf life | Late or lost parcels | Confirm each courier's rules; owner can switch off a courier per destination; show arrival windows, not guarantees |
| Wrong or incomplete recipient address | Failed delivery | Validated state and postcode, recipient phone required, buyer confirms address on the summary |
| AI-generated code writes sensitive data from the browser | Wrong prices, forged payment status | Prompt 6 audit, rules tests, all writes to orders, payments and capacity only through Cloud Functions |
| Overbooking on busy days | Unhappy customers, wasted ingredients | Transactional capacity counter, daily limit set by owner, 30-minute hold |
| Payment gateway does not accept a home-based business | Launch slips | Start applications in Phase 0 with 2 gateways; keep manual transfer with receipt upload as a fallback |
| Google AI Studio or Firebase feature changes | Rework | Everything is exported to GitHub as ordinary React and Firebase code, so the project does not depend on AI Studio after export |
| Cost surprise from Blaze plan | Unexpected bill | Budget alert at RM50, query limits, no open listeners on large collections |
| Missed licensing or labelling duties | Fines, reputational damage | Section 5.2 checklist signed off by the owner before launch |
| Single builder unavailable | Delay | Runbook in docs/, all work in pull requests, second reviewer named |

### 9.4 Running cost (approximate; verify on each provider's pricing page)

| Item | Expectation at launch volume |
| --- | --- |
| Firebase (Hosting, Firestore, Auth, Storage) | Within or near free quotas at a few dozen orders a day |
| Cloud Functions and scheduled jobs | Needs the Blaze plan; low usage cost, covered by the budget alert |
| Domain name | Small yearly fee |
| Email sending service | Free tier is enough at launch |
| Payment gateway | Per-transaction fees set by the gateway; get written quotes for FPX, DuitNow QR and card |
| GitHub | Free private repository and enough free Actions minutes at this size |

### 9.5 Open questions for the owner

- [x] Which payment gateway, and is the home business registered with SSM in a form the gateway accepts?
- [x] Daily capacity in cake slots, and the weight of a Whole and a Loaf (e.g. Loaf = 0.25, Whole = 1)?
- [ ] Decided: cakes are defrosted by the owner and travel at room temperature with a 5-day shelf life. Which box and packed weight should be used for a Whole, a Loaf and a Budget set?
- [ ] Decided: ship to Sabah and Sarawak as well. How many days should the arrival estimate show for each, given the 5-day shelf life?
- [ ] Decided: courier dispatch is Monday to Wednesday. What is the order cut-off time before a dispatch day?
- [ ] Balik Pulau: which postcodes and delivery days, and is RM5 flat even for several cakes?
- [ ] Decided: delivery stays as courier (Pos Laju, Citylink, J&T) plus Balik Pulau self-delivery at RM5; the form's other options (Lalamove, pick-up) are not used.
- [ ] Decided: the Budget Combo is RM100 per set of Whole-size cakes and customers can buy several sets. Please confirm the RM100.
- [ ] Decided: Whole prices as on the form, Loaf prices RM5 higher. Please confirm, and say how durian prices should change with the variety available.
- [ ] Decided: the shop runs all year with fixed weekly dispatch days, and seasonal pre-order campaigns (like Aidiladha) are switched on for busy periods.
- [ ] Courier flat rate: what is the flat fee for West Malaysia, and is it the same or higher for Sabah and Sarawak (parcels are booked by hand, with no courier business account)?
- [ ] Decided: a cancelled order forfeits the amount paid, and damage or delay is claimed only through the order page with photos. Still needed: how many days after delivery can a claim be made, and is the outcome a replacement or a refund?
- [x] Is a halal certificate held, and may the site use the logo?
- [x] Is the business above the SST or e-invoice thresholds?
- [ ] Decided: the owner's own Google and GitHub accounts. Which email addresses should they use?
- [ ] Decided: the owner writes the product text in Bahasa Malaysia and photographs the cakes. Is an English version needed at launch?
