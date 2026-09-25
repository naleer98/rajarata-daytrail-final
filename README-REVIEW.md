# RajaRata DayTrail — reviewed project

This is a corrected review copy of the previously supplied project source. It is not a claim of final acceptance or a live deployment. Read `review/COMPARISON.md` before replacing your local project.

## Local setup (Windows / VS Code)

1. Back up your current project folder and database. If you have changes newer than the submitted ZIP, merge the listed changes instead of overwriting your folder.
2. Open this project folder in VS Code.
3. In a terminal: `cd backend`, then `npm ci`.
4. Copy `backend/.env.example` to `backend/.env`. Fill in your existing database connection, a strong JWT secret and your VERIFIED registered home coordinates. The example coordinates are the old project's reference, not confirmation of your home. Never commit `.env`.
5. Optional: fill in Cloudinary credentials to use Cloudinary. Without them uploads use `backend/uploads`.
6. Start the backend with `npm run dev`.
7. Open a second terminal: `cd frontend`, `npm ci`, `npm run dev`.
8. Visit `http://localhost:3000`. Backend port is 5000. The Vite development proxy sends `/api` and `/uploads` to the backend.
9. Run backend regression tests: `cd backend`, `npm test`. Build the frontend: `cd frontend`, `npm run build`.

The ZIP intentionally omits `.env`, `node_modules` and generated `dist`. Local uploaded images are included. There is no Atlas database export in this package. Using your existing database requires your own configuration. Changing the home reference does not migrate distances already stored in MongoDB; verify/recalculate existing records before the viva.

## Seed data

Do not run seed commands against your existing database. `npm run seed` now refuses a nonempty places/users database, but seed data is still demonstration data with sample accounts. Use a separate empty test database if you need it. Confirm real hours, fees, contact numbers, coordinates and image identities before submission. Do not use sample account credentials in production.

## Evidence and limitations

- `review/COMPARISON.md`: guideline, proposal and SRS mapping; document updates and remaining checks.
- `review/backend-test-results.txt`: 27 local regression tests, using mocked database operations and one real local HTTP authorization request.
- `review/frontend-build-results.txt`: TypeScript/Vite production build output.
- `backend/test/review.test.js`: reproducible tests. They do not connect to Atlas.
- Browser workflows, real MongoDB writes, Cloudinary upload, map service availability, mobile/cross-browser behavior and end-to-end performance still need acceptance testing.
- Build reports a large JavaScript chunk warning; build succeeds. This is not a demonstrated runtime failure.

No Git history was fabricated and no repository was pushed. Existing proposal/SRS PDFs were not silently rewritten. Their required corrections are listed in the comparison.
