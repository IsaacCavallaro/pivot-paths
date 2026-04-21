# Pivot Paths

## Overview

Pivot Paths is a mobile app built with Expo and React Native for dancers navigating career transition. It combines guided paths, reflections, progress tracking, and curated learning content across three core areas:

- Career Transition
- Mindset & Wellness
- Finance

The app is designed to help users choose a direction quickly, build momentum over time, and return to their progress without losing context.

## Data Storage and Privacy

User progress, reflections, and quiz-style results are stored locally on the device with AsyncStorage. There is currently no account system or cloud sync, so app progress stays tied to the device unless the app data is cleared or the app is uninstalled.

Some parts of the experience open external resources, including the Pivot For Dancers website, social links, and video content. Those destinations may have their own analytics, cookies, or privacy practices outside this app.

## Development

```bash
npm install --legacy-peer-deps
npm run dev
```

If your shell injects a local HTTP proxy, run installs and Expo commands with the proxy variables unset.

## Technologies Used

- Expo
- React Native
- Expo Router
- TypeScript
