# YOSHA STORE Mobile

Expo + React Native application for Android and iOS. The mobile app shares the existing Supabase project and database with the Next.js website.

## Brand and design

The mobile UI follows the live website identity:
- Forest green primary palette (#16834E / #14532D), mint surfaces, white cards and soft green borders.
- The official YOSHA emblem and wordmark are rendered from the website's `public/ys-logo.svg` asset through the shared `Brand` component.
- Shared design tokens live in `theme.ts`.
- Arabic-first, right-aligned screens with matching green hero panels, rounded cards, typography hierarchy and navigation styling.
- Customer storefront, authentication, seller workspace, admin overview and account screens use the same design language.

## Setup

1. Install Node.js LTS and npm.
2. Copy `.env.example` to `.env`.
3. Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` using the existing Supabase project URL and publishable key.
4. From this directory run:

    npm install
    npx expo start

Scan the QR code with Expo Go for development, or use an Android emulator / iOS simulator.

## Build installable apps

Install EAS CLI and authenticate:

    npm install -g eas-cli
    eas login
    eas build:configure
    eas build --platform android --profile preview
    eas build --platform ios --profile preview

For Google Play use an Android production AAB build. iOS distribution requires an Apple Developer account.

## Security

- Never place a Supabase secret/service-role key in this app. Only the publishable key belongs in the mobile client.
- Database Row Level Security remains the authority for customer, seller and admin access.
- The initial admin screen is read-only. Administrative mutations must be added only after reviewing and testing existing database functions and permissions.
- Do not bypass website subscription, checkout, or payment rules.

## Current scope

- Email/password sign-in and sign-up through Supabase Auth.
- Live product and approved-store listing with local product-name search.
- Initial seller and admin dashboards using the existing database.
- Shared accounts and records with the website.
- Branded visual system aligned with the website.

Checkout, seller product editing, order processing, push notifications, deeper role-specific navigation and App Store / Play Store release are planned follow-up stages. The app has not yet been type-checked, device-tested or built into APK/AAB/IPA artifacts.


## Android test APK

A GitHub Actions workflow is provided at `.github/workflows/mobile-android-apk.yml`.
Before building, add these two repository Actions secrets under **Settings → Secrets and variables → Actions**:
- `EXPO_PUBLIC_SUPABASE_URL`: the existing Supabase project URL.
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: the project's publishable key (never the service-role/secret key).

To build a signed-for-testing (debug) APK:
1. Open the repository's Actions tab.
2. Select **Build YOSHA STORE Android APK**.
3. Choose **Run workflow** and select `feature/yosha-mobile-app`.
4. When the run succeeds, open the run's Artifacts section and download `yosha-store-android-debug-apk`.
5. Extract the ZIP and install `app-debug.apk` on an Android phone. Allow installation from the browser/file manager if Android asks.

This is a debug/test APK, not a Play Store release. The app also needs the Supabase project URL and publishable key at build time to connect to the live account/database. Do not use a service-role or secret key in the app.
