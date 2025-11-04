import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // GitHub Pages 使用仓库名作为 base 路径
  // 如果仓库名是 username.github.io 格式，使用根路径 '/'
  // 否则使用 /仓库名/ 作为 base 路径
  base: process.env.GITHUB_PAGES 
    ? (process.env.REPO_NAME && process.env.REPO_NAME.endsWith('.github.io')
        ? '/'
        : process.env.REPO_NAME 
          ? `/${process.env.REPO_NAME}/`
          : '/')
    : '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsDir: 'assets',
  },
});

