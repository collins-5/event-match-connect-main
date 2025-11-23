# EventMatch React Native Client

This Expo workspace hosts the native version of the EventMatch experience. It mirrors the Vite web app while reusing Supabase, React Query, and business logic from the shared layer.

## Getting Started

```bash
cd mobile
pnpm install # or npm install / bun install
expo start
```

### Environment
Create a `.env` file inside `mobile/`:

```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

These map to the same values used by the web client (`.env.local`).

## Project Layout

- `app/` — Expo Router routes (tabs for home/events/chat/profile, stack for auth + details)
- `src/lib/supabase.ts` — AsyncStorage-backed Supabase client
- `src/providers/` — React Query + Supabase session context
- `src/screens/` — Feature screens migrated from `src/pages` in the Vite app
- `src/components/` — Mobile-optimized UI (cards, chat bubbles, nav)
- `src/theme/` — Color + spacing tokens for NativeWind

Refer to `../docs/react-native-migration.md` for the multi-phase migration plan.

