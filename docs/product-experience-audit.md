# CalmaTrip product experience audit

## Product direction

CalmaTrip should feel like one trusted Tunisian travel marketplace with three
purpose-built workspaces, rather than three unrelated applications. The public
experience should optimize discovery and confidence, the traveler space should
organize the trip lifecycle, the partner space should help suppliers publish and
operate inventory, and the backoffice should help staff review exceptions and run
the marketplace safely.

Airbnb and GetYourGuide are useful references for hierarchy, trust, progressive
disclosure and operational clarity. Their branding and interaction details should
not be copied. CalmaTrip keeps its cream, terracotta, blue-grey and Tunisian visual
identity.

## Findings corrected in this pass

- Removed public conversion widgets from traveler, partner and admin workspaces.
- Removed the novelty cursor and standardized the global neutral canvas.
- Replaced stale “Sahara Tunisia” metadata with CalmaTrip product language.
- Put Explore in the primary discovery navigation; the logo already provides Home.
- Made traveler dashboard views bookmarkable with `?view=` URLs.
- Fixed traveler navigation where badges incorrectly made inactive sections look active.
- Added sensible maximum widths and quieter professional elevation to workspaces.
- Made admin navigation permission-aware and private-space routing role-aware.
- Made admin and partner top bars describe the current task instead of always saying Dashboard.
- Blocked non-approved partners from catalog, sales and analytics APIs and routes.
- Separated artisan and agency operating models: agencies manage discovery listings;
  artisans manage products, services and their resulting transactions.
- Corrected artisan revenue so product orders and service bookings are both included,
  while net revenue only includes confirmed/paid business.
- Removed the agency reservation screen because Explore listings are not currently
  connected to a bookable inventory model. Showing an always-empty revenue surface
  would be misleading.

## Canonical information architecture

### Traveler

Discover → Experiences → Marketplace → Guides → Community → Trip workspace.

The trip workspace centers the next trip, then actions required, trip details,
history, reviews and profile. It should not look like an internal analytics dashboard.

### Artisan partner

Overview → Products → Services → Sales & revenue → Partner profile.

Every offer has a clear moderation state. Revenue combines marketplace product
orders and bookings for services owned by the artisan.

### Agency partner

Overview → Explore listings → Partner profile.

Agency listings are editorial/discovery inventory today. Reservations and earnings
must only be introduced once a real relation exists between an Explore listing,
availability, price, booking ownership and commission snapshot.

### Backoffice

Dashboard → Content/CMS → Commerce → Partners & submissions → Users & access.

Navigation is filtered by server-backed permissions. Content roles never inherit
payments, customer records or partner approval merely by entering `/admin`.

## Next product increments

1. Unify Experience, Service and Explore terminology into a documented catalog model.
2. Decide whether agency listings remain discovery-only or become bookable inventory.
3. Move traveler dashboard views from query-state to nested routes when their forms
   and histories become large enough to warrant independent loading boundaries.
4. Add shared workspace primitives for page headers, filters, tables, empty states and
   status badges, then migrate legacy admin modal CRUD screens incrementally.
5. Replace hard-coded public contact and business values with the new site settings service.
6. Finish locale persistence server-side so metadata and initial HTML match FR/EN/AR.
