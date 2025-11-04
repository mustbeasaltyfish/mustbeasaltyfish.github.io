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
  // 如果设置了 REPO_NAME 环境变量，使用它；否则使用默认值
  base: process.env.GITHUB_PAGES 
    ? (process.env.REPO_NAME ? `/${process.env.REPO_NAME}/` : '/Personal_web/')
    : '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsDir: 'assets',
  },
});

