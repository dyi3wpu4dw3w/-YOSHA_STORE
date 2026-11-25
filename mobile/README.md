# YOSHA STORE Mobile

Expo + React Native application for Android and iOS. The mobile app shares the existing Supabase project and database with the Next.js website.

## Setup

1. Install Node.js LTS and npm.
2. Copy .env.example to .env.
3. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY using the existing Supabase project URL and publishable key.
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
- Live product and approved-store listing.
- Initial seller and admin dashboards using the existing database.
- Shared accounts and records with the website.

Checkout, seller product editing, order processing, push notifications and App Store / Play Store release are planned follow-up stages.
