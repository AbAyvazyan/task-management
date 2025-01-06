import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig({
  base: '/task-management/',
  plugins: [
    react(),
    svgr({
      svgrOptions: { exportType: 'default', ref: true, svgo: false, titleProp: true },
      include: '**/*.svg',
    }),
    checker({ typescript: true }),
  ],
  resolve: {
    alias: {
      '@assets': resolve(__dirname, './src/assets'),
      '@pages': resolve(__dirname, './src/pages'),
      '@app': resolve(__dirname, './src/app'),
      '@utils': resolve(__dirname, './src/utils'),
      '@layouts': resolve(__dirname, './src/layouts'),
      '@components': resolve(__dirname, './src/components'),
    },
  },
  server: {
    open: true,
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
});
