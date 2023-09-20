import { defineConfig } from "umi";

export default defineConfig({
  dynamicImport: {
    loading: '@/components/PageLoading',
  },
  publicPath: './',
  routes: [
    {
      component: "@/layouts/index",
      routes: [
        { path: "/Home", component: "@/pages/index" },
        // { path: "/docs", component: "@/src/pages/docs" },
      ],
    },
  ],
  // npmClient: 'pnpm',
});
