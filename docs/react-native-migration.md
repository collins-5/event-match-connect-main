## React Native Migration Plan

### Goals
- Deliver a feature-parity EventMatch mobile app using React Native (Expo) without regressing Supabase auth, event discovery, chat, or onboarding flows.
- Share logic, Supabase types, and state-management strategies with the existing web client where practical.
- Provide a migration path that supports incremental delivery (ship mobile while web stays operational).

### High-Level Approach
1. **Create a dedicated Expo workspace** (`mobile/`) that coexists with the Vite SPA. Expo offers the smoothest DX for Supabase + RN, handles OTA updates, and gives us access to native modules with minimal config.
2. **Reuse business logic**:
   - Move all shared schemas/types to `src/shared/` (or generate via Supabase).
   - Reuse hooks (React Query, Supabase CRUD) by extracting DOM-specific code.
3. **Swap UI layer**:
   - Replace Tailwind/Radix with NativeWind + Expo Router layouts, plus React Native Paper primitives for accessible components.
   - Implement Bottom Navigation via `@react-navigation/bottom-tabs`.
4. **Maintain Supabase integration**:
   - Use the same `supabase-js` client configured with `@react-native-async-storage/async-storage`.
   - Polyfill `URL`, `crypto`, and `fetch` via `react-native-url-polyfill` and `react-native-get-random-values`.
5. **Parity-first screen migration**:
   - Home (feed + AI CTA), Events list/detail, Chat (LLM assistant + threads), Profile, Auth, Onboarding.
   - Defer NotFound and marketing pages.
6. **Testing & release**:
   - Snapshot shared hooks, add Detox/E2E smoke tests for auth + navigation.
   - Use Expo EAS build for beta distribution.

### Target Architecture
```
mobile/
  app/
    _layout.tsx            # Expo Router root stack (auth vs tabs guard)
    (auth)/                # SignIn, Onboarding
    (tabs)/                # Bottom tabs: home, events, chat, profile
    event/[id].tsx         # Modal/stack push for event details
  src/
    lib/
      supabase.ts          # AsyncStorage-backed client
    hooks/
      useSession.ts        # Supabase auth state sync
      useEvents.ts         # React Query wrappers, reused from web
    components/
      EventCard.tsx
      BottomSheet.tsx
      ChatMessageList.tsx
    theme/
      colors.ts
      typography.ts
```

### Dependency Map
| Web dependency | RN equivalent / notes |
| --- | --- |
| `react-router-dom` | Expo Router (`expo-router`) + `@react-navigation` |
| Radix UI components | React Native primitives + React Native Paper + custom components |
| TailwindCSS + shadcn | NativeWind (Tailwind-in-RN), Dripsy, or styled-components |
| `sonner` / `@radix-ui/react-toast` | Expo's `ToastAndroid` / `react-native-toast-message` |
| `lucide-react` icons | `lucide-react-native` |
| `embla-carousel-react` | `react-native-reanimated-carousel` |
| `react-day-picker` | `react-native-calendars` |

### Migration Phases
1. **Scaffolding (this PR)**:
   - Initialize Expo project with Router, navigation, React Query + Supabase providers, placeholder screens.
   - Document environment variables and shared logic strategy.
2. **Auth & session parity**:
   - Implement Supabase email OTP + magic link flows.
   - Port Onboarding wizard screens with RN forms (`react-hook-form` + `zod`).
3. **Core experiences**:
   - Home feed, events list/detail (sharing query logic).
   - Chat assistant using existing Supabase Edge Function endpoints.
4. **Refinement**:
   - Bottom sheet interactions, toasts, AI suggestion CTA, profile editing.
5. **Release hardening**:
   - Add jest + Detox tests, QA checklist, CI pipeline with Expo EAS.

### Shared Code Strategy
- Extract `src/lib/utils.ts`, event types, and query hooks into `src/shared/`.
- Use TypeScript project references (`tsconfig.base.json`) to allow both web and mobile to import from `src/shared`.
- Keep platform-specific UI in `web/` vs `mobile/`.

### Outstanding Questions
1. Are push notifications required at launch? (Expo Notifications vs. FCM/APNs).
2. Do we need offline caching for events?
3. Chat feature parity: is streaming mandatory on mobile?

Answering these will tighten scope for the next milestone.

