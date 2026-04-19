# KFUPM ParkWise

KFUPM ParkWise is a production-style responsive web application for the KFUPM Mobility Solutions Challenge. It uses the shared English report as the main domain source for permit categories, prohibited lots, Building 64 special rules, commuter curfew logic, bus route summaries, challenge evidence, and violation analytics.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Modular mock API route handlers
- PostgreSQL or Supabase-style SQL schema seed
- Cloudflare-friendly API separation for future migration

## Main Product Areas

- Landing page with challenge framing and feasibility story
- Authentication flow pages
- Student dashboard with category badge, permission summary, AI recommendation preview, bus summary, and notifications
- Parking map, lot detail, slot view, and parking session monitoring
- Bus tracking for male and female route networks
- AI recommendation engine page
- Rules and policy page with Building 64 override logic
- Profile page with category and alert settings
- Admin operations, sensors, lots, rules, buses, and analytics pages
- Architecture, implementation, how-it-works, and competition-insights pages

## Domain Logic Used

- Four permit categories:
  - Resident Male Student
  - Non-Resident Male Student
  - Resident Female Student
  - Non-Resident Female Student
- Non-resident students must leave by `10:00 PM`
- Academic parking is generally allowed after `5:00 PM` until `7:00 AM` except prohibited lots
- Building 64 override:
  - Levels 1 and 2 are faculty and staff only
  - Level 0, level 3, and uncovered 64 are for off-campus students
  - On-campus residents are prohibited from those student-access areas

## Project Structure

```text
app/
  api/
  admin/
  architecture/
  buses/
  competition-insights/
  dashboard/
  how-it-works/
  implementation/
  login/
  notifications/
  parking/
  profile/
  recommendations/
  register/
  rules/
components/
  cards/
  layout/
  ui/
lib/
  constants.ts
  data/kfupm-data.ts
  engines/
  services/
  types.ts
  utils.ts
```

## Run Locally

1. Install Node.js `16.14+`.
2. Install packages:

```bash
npm install
```

3. Start the dev server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm start
```

If sandbox restrictions block worker spawning, run the build outside the sandbox in the Codex desktop environment.

## Mock APIs

- `GET /api/lots`
- `GET /api/lots/[lotId]`
- `GET /api/slots`
- `GET /api/buses`
- `GET /api/bus-routes`
- `GET /api/bus-stops`
- `GET /api/rules`
- `GET /api/notifications`
- `GET /api/recommendations?destination=Building%2064&duration=3`
- `POST /api/sensors/ingest`

## Live Hardware Integration Notes

- Replace the `app/api/sensors/ingest/route.ts` handler with live ESP32 or Raspberry Pi ingestion.
- Move the arrays in `lib/data/kfupm-data.ts` into PostgreSQL, Supabase, or Cloudflare D1 tables.
- Keep the rule logic in `lib/engines/rules.ts` and `lib/engines/recommendations.ts` so UI pages stay clean.
- Bus GPS, sensor heartbeat, and notification scheduling can plug into the existing route handlers without changing the UI structure.

## Verification

- `npx tsc --noEmit`
- `npm run build` should work when Next.js can spawn its worker process in the host environment
