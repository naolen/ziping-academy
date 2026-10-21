import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// 相对路径 + HashRouter：无论部署在用户名站点根目录还是 /repo/ 子路径，都能直接打开。
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
