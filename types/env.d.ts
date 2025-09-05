declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_URL?: string;
      EXPO_PUBLIC_YOUTUBE_API_KEY?: string;
    }
  }
}

export {};