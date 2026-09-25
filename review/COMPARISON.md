# RajaRata DayTrail — guideline, proposal and SRS comparison

## Review basis and scope

Sources: supplied project source previously extracted from rajarata-daytrail.zip; ITE2953_ProjectProposal_E2410076(1).pdf; RajaRata_DayTrail_Final_SRS_E2410076.pdf; Project Introduction and Problem Specification(5).pdf; final system/report submission instructions pasted in this conversation.

The source files were available; another upload is not needed for this baseline review. If the project has changed since the uploaded ZIP, provide the newer source before applying changes wholesale. This review does not authenticate the home coordinate, lecturer approval, real stakeholder testimony or current Atlas contents.

Status vocabulary: **Implemented** = observable code path exists, not an end-to-end pass. **Corrected locally** = changed code with the verification limits stated below. **Pending acceptance** = must run with the real application/data. **Document action** = truthful evidence or document reconciliation needed.

## Guideline compliance

| Requirement | Finding / action |
|---|---|
| Web information and local visit planning | React + Vite, Express and MongoDB implementation exists. |
| At least 10 locations within 25 km of home | Seed contains ten places, all within the configured reference radius (approximately 2.63–12.48 km). Actual registered home, live active count and place coordinate accuracy remain unverified. Server create/update now rejects locations beyond the precise 25 km radius. Existing database records still need review. |
| Place list, filters, essential details and map | Implemented; contact display and editable travel tips corrected. Browser/map acceptance still pending. |
| One-day selection/planning | Implemented; missing-hours warning and stale-save defects corrected. Overnight plans explicitly warned. |
| Admin add/edit/delete | Add failed required slug validation in the original source. Unique slug generation and input validation corrected. Actual CRUD against test MongoDB remains pending. |
| No booking/payment | No such application feature found in reviewed routes. Entry-fee text is informational. |
| Four colleagues as stakeholders | Proposal has four-person summary and forum screenshots. Final SRS has general roles but lacks equivalent four-person consultation/validation evidence. Include authentic responses and decisions. |
| Approved stack | Code broadly matches proposed stack; actual approval not evidenced here. |
| Design deliverables | SRS includes context/architecture, use-case, planner activity and data relationship diagrams. Required complete STAR UML use-case, activity, sequence, class and ER/EER models plus UI design evidence must be finalized. Existing SRS diagrams do not prove STAR UML authoring or sufficient detail. |
| Git history | No .git history in supplied archive; a ZIP can omit it. Supply actual repository URL/history. Never invent earlier commits. |
| Presentation/video | Not present in supplied project package. Prepare title + at most five content slides, and a working-system video. |

## Proposal comparison

| Proposal promise | Original implementation | Review outcome |
|---|---|---|
| Ten local places and distance | Ten seed records; Haversine code | Verify actual home/data; update proposal distances, which differ from code-generated distances. |
| Search and categories | Implemented | Escaped literal search and fixed reset behavior; browser check pending. |
| Complete details and images | Details modal; contact not displayed; one-image admin input | Contact and extra stored image display added; extra images preserved on edit. Dedicated multi-image uploader remains an optional usability improvement. |
| Cultural etiquette | Stored tips/dress code plus hard-coded religious rules applied to every place | Removed unconditional religious rules from details; place-specific stored guidance remains. Added missing travel-tips editing field. |
| Interactive map | Stored coordinates and OSM tiles; hard-coded home marker | Home marker reads API configuration; tile failure message added without removing list. Real service check pending. |
| Google Maps directions | Individual destination links | Implemented. A combined multi-stop route link is not present; proposal route wording should clarify individual-stop guidance or combined-route navigation must be added if expected. |
| Nearest-next route | Implemented using Haversine distances | Unit checked; not a road-network optimizer and not a globally optimal route. |
| Smart timing and summary | Arrival/departure, total distance, travel time, return journey and end time | Corrected validation and next-day warning. UI now explicitly calls values estimates. |
| Relaxed/Balanced/Fast | Duration multipliers implemented | Tested. Proposal also mentions suggested number of places; no pace-based count recommendation exists. Clarify that pace adjusts duration or implement this remaining enhancement. |
| Opening-time warnings | Missing times defaulted to 08:00, causing fabricated warnings | Fixed independently missing times; added visit-overrun and overnight handling tests. |
| Saved plans | User-owned MongoDB records | Recomputed server-side from current place records, preventing client totals from being trusted; stale result invalidated in UI. Real save/load test pending. |
| Admin management | Protected routes but create omitted slug; create ignored inactive state | Fixed; actual DB acceptance pending. |
| About Anuradhapura | No dedicated route | Added /about informational planning page and footer link. |
| Page organization | Login shared; place details/add/edit are modals; summary embedded in planner | Functional equivalence may be acceptable; document actual UI rather than claiming separate pages. |
| Cloudinary or managed images | Cloudinary/local fallback code | Fixed environment initialization before route import. Upload service not tested. |
| Deployment | Proposed hosting; local development proxy present | No verified live deployment supplied. Do not claim deployed Vercel/Render URLs without evidence. |

## Confirmed changes in this review

1. Required unique slug generated during place creation; respects isActive.
2. all=true catalogue requires authenticated admin; public detail excludes inactive records.
3. Literal search safely handles regex characters; overlong/non-string queries rejected.
4. Place create/update validate coordinates, radius, category, text, hours, duration, arrays and boolean status. Editable fields are allowlisted; client slug/system fields cannot overwrite server fields.
5. Distance computation keeps precision for 25 km boundary checks; display distance rounded separately.
6. Empty/invalid planner inputs and unavailable place IDs produce validation responses instead of misleading partial plans.
7. Missing schedule information no longer fabricates 08:00 opening/closing warnings. Overnight hours, overrun visits and next-day ending have explicit handling.
8. Saving recalculates route/totals using database records and fixes travel-to-next field semantics.
9. UI invalidates generated plan after changing selected places, pace or start time; ignores obsolete generation responses.
10. Map uses server home coordinate and displays tile-load warning.
11. Details show contact and extra stored images; guidance uses stored data; admin travel-tips input added.
12. Search reset refreshes even when already in All category.
13. About page and timing estimate notice added; JSX included in TypeScript build configuration.
14. dotenv loaded before route module evaluation so Cloudinary configuration can see .env values.
15. Upload extension/MIME pairing tightened (this is not complete file-content security scanning).
16. Registration/login type checks added; duplicate email lookup normalized.
17. Seed refuses nonempty places/users collections rather than clearing them.

## SRS functional requirements (all 53)

The following mapping states implementation and verification limits explicitly. FR numbers refer to the supplied final SRS.

| ID | Requirement / evidence | Status and remaining work |
|---|---|---|
| FR-001 | Ten verified places / seedPlaces.js | Data pending: seed has ten; verify home, live count and factual data. |
| FR-002 | Catalogue name/category/summary / Explore, PlaceCard | Implemented; browser acceptance pending. |
| FR-003 | Supported categories / Place schema, Explore | Implemented; data uses subset, which is allowed. |
| FR-004 | Active-only visitor catalogue / placeController | Corrected: admin-only all=true and active-only detail. Local query/HTTP checks passed. |
| FR-005 | Desktop/tablet/mobile catalogue | Responsive classes exist; device acceptance pending. |
| FR-006 | Keyword search / placeController | Implemented; escaped literal queries locally tested. |
| FR-007 | Category filtering / Explore + API | Implemented; live acceptance pending. |
| FR-008 | Combined search/category | Implemented; live acceptance pending. |
| FR-009 | Empty-result message / Explore | Implemented; browser acceptance pending. |
| FR-010 | Description, location, images, hours, duration, distance / details modal | Implemented; additional stored photos display added; verify actual images/hours. |
| FR-011 | Relevant cultural guidance / details modal | Corrected unconditional religious guidance; verify stored guidance. |
| FR-012 | Facilities, entry and contact / details modal | Contact display added; verify data and browser presentation. |
| FR-013 | Best time and visit duration / details modal | Implemented; data verification pending. |
| FR-014 | Admin-maintained source / API and details | Implemented; real CRUD-to-public integration pending. |
| FR-015 | React Leaflet + OSM / InteractiveMap | Implemented; online map test pending. |
| FR-016 | Stored-coordinate markers | Implemented; real coordinates and map placement pending. |
| FR-017 | Google Maps directions | Individual destination links implemented; full-route link not implemented. |
| FR-018 | Home Haversine distance | Calculation tested; map reference synchronized. Actual home confirmation and existing-record recalculation pending. |
| FR-019 | Map failures preserve available information | Tile-error message added; offline/browser simulation pending. |
| FR-020 | Registration / authController | Implemented with improved input checks; real DB registration pending. |
| FR-021 | User/admin login | Implemented; live credential acceptance pending. |
| FR-022 | bcrypt password hashing / User model | Pre-save hashing exists; persisted hashes need real database test. |
| FR-023 | JWT authentication / auth middleware | Implemented; anonymous protected HTTP access test passed. Full token tests pending. |
| FR-024 | Admin role restrictions | Middleware on mutations and all-record list; tourist-role acceptance pending. |
| FR-025 | Invalid-login error | Generic message implemented; browser/API acceptance pending. |
| FR-026 | Multiple selections / DayPlanner | Implemented; browser acceptance pending. |
| FR-027 | Three pace options | Implemented; duration behavior locally tested. |
| FR-028 | Start time input/default 08:00 | Implemented and server validation improved; remove contradictory TBD in Appendix C. |
| FR-029 | Stored visit duration | Implemented and locally tested. |
| FR-030 | Structured ordered plan | Implemented; nearest-next test passed. |
| FR-031 | Totals and finish time | Implemented; return journey and time arithmetic tests passed; full UI test pending. |
| FR-032 | Reject empty selection | Implemented; local test passed. |
| FR-033 | Nearest-next sequence | Implemented and locally tested. |
| FR-034 | Estimated travel time | Haversine / 30 km/h plus five-minute buffer; estimates, not live road routing. |
| FR-035 | Arrival/visit/end timing | Implemented and locally tested; early arrival is warned, not automatically rescheduled to wait. |
| FR-036 | Pace-based duration | Implemented and tested; no count recommendation. |
| FR-037 | Do not claim mathematically optimal route | Estimate disclaimer added; about page explains practical ordering. |
| FR-038 | Compare arrival with available hours | Corrected; missing/early/late/overnight local tests passed. |
| FR-039 | Late arrival warning | Locally tested. |
| FR-040 | Warnings in summary | Engine returns warnings; UI renders them; browser acceptance pending. |
| FR-041 | No fabricated missing-hours warning | Confirmed original failure and fixed; local test passed. |
| FR-042 | Summary totals/order/warnings | Implemented; browser acceptance pending. |
| FR-043 | Authenticated itinerary save | Corrected server recomputation; mocked persistence test passed; Atlas pending. |
| FR-044 | itineraries collection | Mongoose model exists; live persistence pending. |
| FR-045 | Own saved plans | User-filtered query and SavedPlans page exist; account separation test pending. |
| FR-046 | Associate saved plan to user | Uses req.user._id; locally checked with mocked persistence. |
| FR-047 | Admin add place | Original slug failure fixed; schema/controller test passed; live CRUD pending. |
| FR-048 | Admin edit place | Allowlisted validated update; live edit acceptance pending. |
| FR-049 | Delete/deactivate place | Delete route and active flag exist; test saved-plan behavior after deletion on real data. |
| FR-050 | Maintain place information and status | Travel-tips UI added, inactive create respected; multi-image admin UI still single-primary input with existing extras preserved. |
| FR-051 | Persist admin changes in Atlas | Code exists; no live Atlas writes performed. |
| FR-052 | Validate place input | Required text, category, coordinates, radius, hours, duration, types and allowlist tests passed; live API coverage pending. |
| FR-053 | Prevent non-admin operations | Middleware exists; broader tourist/expired-token tests pending. |

## Non-functional and business-rule coverage

| SRS IDs | Finding |
|---|---|
| NFR-PERF-01, 02, 03, 04 | No browser/Atlas end-to-end timing performed. Do not claim the three-second target passed from unit-test timings. Build succeeds with a >500 kB JS chunk warning. Device responsiveness and slow-service behavior pending. |
| NFR-SAFE-01 | Estimate/nearest-next limitation notice added. |
| NFR-SAFE-02 | Stored tips/guidance shown and editable; verify content and relevance. |
| NFR-SAFE-03 | No booking/emergency/ticketing implementation; keep that scope. |
| NFR-SEC-01, 02, 03 | bcrypt and JWT/admin middleware in code; limited local authorization test, live identity tests pending. |
| NFR-SEC-04 | Validation strengthened; this review is not a penetration test. |
| NFR-SEC-05 | Generic login failures present; no secrets printed in deliverable. |
| NFR-SEC-06 | Production HTTPS depends on actual deployment; unverified. |
| NFR-QUAL-01, 02, 06 | Usability, browser support and consistent visual behavior require manual evidence. |
| NFR-QUAL-03 | Frontend/API/model separation exists. |
| NFR-QUAL-04 | Missing schedules corrected, map message added, extra images preserved; cloud/network failure acceptance still pending. |
| NFR-QUAL-05 | Added reproducible Node test command; Postman acceptance collection/results not yet created. |
| BR-01 | Validate actual registered home and ten active places; create/update radius enforcement added. |
| BR-02 | Current fees/hours/contact details/images are unverified. |
| BR-03 | Admin mutation gates exist; negative role tests still required. |
| BR-04 | Browsing/generation public, saving authenticated; implemented. |
| BR-05 | No booking/payment; satisfied by reviewed code scope. |
| BR-06 | Nearest-next algorithm implemented; limitation stated. |

## Required proposal/SRS updates (not silently edited)

- Add authentic four-colleague consultation evidence to the SRS, with dates, comments, accepted/rejected requirements and validation outcomes. Proposal page 16 contains actual screenshots despite the heading “Evidence Placeholders”; rename it. Confirm evidence covers all four colleagues, not only a summary.
- Resolve registered home and update every place distance consistently. Proposal preliminary distances differ from the implemented reference calculations; mark preliminary data as superseded with verified final data.
- SRS section 6.2 mandates Cloudinary while Appendix C still lists Cloudinary versus managed URLs as TBD. Decide and align the requirement, configuration and report; local fallback is not proof that mandatory Cloudinary use is fulfilled.
- SRS FR-028 specifies a start-time input and 08:00 default, but Appendix C says start-time behavior is TBD. Remove the stale TBD after acceptance.
- SRS NFR-PERF-02 specifies three seconds, but Appendix C still lists quantitative targets as TBD. State exact test conditions and retain honest measured results.
- SRS multilingual support is outside version 1.0, but code has a language selector and translated navigation while many page strings remain English. Either document this as limited optional UI translation or remove it from the final scope. Do not claim full trilingual support.
- Document actual UI: shared login, details/add/edit dialogs, embedded summary. About page now exists.
- Clarify per-place navigation versus combined route link, and pace-adjusted durations versus suggested place counts.
- Seed uses example Unsplash URLs, several repeated across different attractions. Verify that each final image actually depicts its place and has appropriate attribution. Do not claim all images/fees/hours verified.
- Proposal table of contents contains “Error! Bookmark not defined.” Repair the source document and update all fields before exporting.
- The brief/footer refers to 25S1 while the later submission portal is 25S2. Confirm the correct course offering for the final cover/footer.
- Existing references include placeholder source descriptions instead of precise URLs. Final report needs verified IEEE references numbered in order of citation; Google Maps URL navigation should not be described as a paid Directions API integration.
- As this is an individual project, describe your implementation contribution separately from colleagues’ real stakeholder contributions; clarify the generic group-contribution instruction if necessary.

## Verification performed

27 backend regression tests passed locally. Tests cover distance and radius boundaries, invalid input, slug/schema validation, literal search, active filtering, schedule warnings, route/pace/timing, unavailable selections, server-generated save totals/owner and anonymous access to all=true. Database calls are mocked; this is not a real Atlas integration pass. One Express HTTP test exercised the protected list without database access.

Frontend production build passed using npm ci followed by npm run build. Build output notes a large chunk; no bundle-size optimization was attempted because correctness was the immediate goal. This is compilation evidence, not visual/mobile verification.

## Acceptance checks still to run together

1. Confirm the home coordinate and record ten real active places with measured distances.
2. Start backend/frontend with your own test database configuration.
3. Register, valid/invalid login, tourist/admin/expired-token access checks.
4. Add, edit, deactivate and delete a temporary place; verify public list and real persistence.
5. Search including punctuation, combined filter, reset and empty results.
6. Verify photos/contact/tips/hours and mobile details layout.
7. Map markers, server home, directions and simulated tile failure.
8. Generate with zero/one/multiple places; all paces; early/late/missing schedules; midnight warning.
9. Generate then change inputs; verify old plan cannot be saved. Save/reload with a user and verify another user cannot see it.
10. Test image upload in the chosen storage configuration.
11. Measure end-to-end planner response against the three-second target under stated normal conditions.
12. Record screenshots, actual results, failures/fixes/retests for Chapter 5.

## What to provide next

No re-upload is needed if these are still your latest files. Otherwise provide the updated project ZIP. Also provide the confirmed home map pin/coordinates, evidence for all four stakeholders, actual GitHub repository URL, and (when testing) the observed local UI/API results. Do not paste .env or credentials into the report. A sanitized places-only export can support live-data review without sharing users or password hashes.

## Suggested final-report sequence

Freeze and accept the system first; then write Chapters 1–4 from the verified requirements/design/technology choices, Chapter 5 from real screenshots/tests, Chapter 6 from achievements/challenges/future work, and finally abstract/front matter/IEEE references and final PDF checks. Deliver system ZIP/video/slides separately from the report PDF as the two portals require.
