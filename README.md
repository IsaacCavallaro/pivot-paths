# Pivot Paths

## Overview

Pivot paths is a mobile app built with Expo and React Native. It provides resources and tools for career transition, mindset wellness, and finance specifically for dancers. The app is structured around three main categories, each containing a set of paths:

- Career Transition: Offers skills assessments and resources for career development.
- Mindset Wellness: Provides tools and games for personal growth and discovering your dream life.
- Finance: Provides resources and tools for financial literacy and planning.

Each category has its own dedicated section within the app, accessible through the tab navigation. Within each category, you'll find a curated list of paths designed to guide you through specific topics and skills.

## Data Storage and Privacy

This application prioritizes user privacy and data security. All data generated within the app, such as skills assessment results, dream life explorations, and personal reflections, is stored locally on the user's device using AsyncStorage.

Specifically, the progress you make on different paths is saved using AsyncStorage in the profile screen (`app/(tabs)/profile.tsx`). This means that your progress is saved directly on your device and is not transmitted to any external servers.

**No data is saved to the cloud or transmitted to any external servers.** This means you have complete control over your information, and your privacy is fully protected. Your progress is only accessible on this device. If you uninstall the app or clear the app's data, your progress will be lost.

We believe in empowering users to own their data and maintain a safe and secure environment for personal growth and exploration

## Technologies Used

- Expo
- React Native
- TypeScript
