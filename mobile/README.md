# YOSHA STORE Mobile

The Android/iOS shell opens the same responsive YOSHA STORE website, so the mobile experience uses the website's existing pages, authentication, cart, checkout, seller workspace and admin routes instead of maintaining a second, incomplete implementation.

## Shared system

- Website: the Render deployment defined by the repository service `yosha-store`.
- Default mobile origin: `https://yosha-store.onrender.com`.
- Optional override at build time: `EXPO_PUBLIC_SITE_URL`.
- The website itself connects to the existing Supabase project. The mobile shell does not ship a second database client or any Supabase secret.
- Sign-in, session cookies, browser storage, product catalog, cart, orders and role-specific pages are handled by the same website and backend as a normal mobile browser.
- Internal site links stay inside the app; external links are handed to the device browser. Android back navigation returns through WebView history.

## Local development

1. Install Node.js 20.19+ and npm.
2. From this directory run:

   ```sh
   npm install
   npx expo start
   ```

3. For a different deployment URL, set `EXPO_PUBLIC_SITE_URL` in `.env` before starting/building.

## Android test APK

A GitHub Actions workflow is provided at `.github/workflows/mobile-android-apk.yml`. Pushes to `feature/yosha-mobile-app` that change `mobile/**` automatically trigger the debug APK build. The workflow validates Expo config and TypeScript, generates the Android project, builds the APK, and uploads the artifact `yosha-store-android-debug-apk`.

The debug APK is for testing, not a Play Store release. iOS distribution still requires an Apple Developer account and a separate iOS build.

## Important scope boundary

The app mirrors the deployed website; it does not create functionality that the website does not yet implement. Payment gateway integrations, proof-review automation, delivery-partner integrations, push notifications, refunds/disputes and any unfinished customer/seller/admin workflows must be completed and verified in the website/backend before they can be considered complete in the app. Payment credentials and service-role keys must never be placed in the mobile binary.
