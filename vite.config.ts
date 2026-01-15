
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Use '.' to refer to the current directory for environment variable loading, 
  // resolving the TypeScript error where process.cwd() is not recognized.
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY)
    },
    server: {
      port: 5173,
      host: true
    }
  };
});
