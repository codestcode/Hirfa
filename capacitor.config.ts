import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hirfa.app',
  appName: 'Hirfa',
  webDir: 'out',
  server: {
    url: 'https://hirfa-five.vercel.app/',
    cleartext: true
  }
};

export default config;
