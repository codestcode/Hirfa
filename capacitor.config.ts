import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hirfa.app',
  appName: 'Hirfa',
  webDir: 'out',
  server: {
    url: 'https://hirfa-amber.vercel.app',
    cleartext: true
  }
};

export default config;
