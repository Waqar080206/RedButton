import { Platform } from 'react-native';

function resolveApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  // Android emulators can't reach the host machine via localhost.
  if (Platform.OS === 'android') return 'http://10.0.2.2:8000';
  return 'http://localhost:8000';
}

export const API_BASE_URL = resolveApiBaseUrl();
