/**
 * Cloudflare Pages Functions - API catch-all
 *
 * Noi lai toan bo logic API cua backend/src/worker.ts (admin login, chat AI,
 * series, orders, hall-of-fame, vectorize reindex...) de /api/* chay cung
 * site Pages, khong can deploy Worker rieng.
 *
 * Cac bindings (DB, KV, VECTORIZE, AI) va biến môi trường (ADMIN_PASSWORD)
 * phai duoc cau hinh tren Cloudflare Dashboard:
 *   Project -> Settings -> Functions -> Bindings (D1 / KV / Vectorize / AI)
 *   Project -> Settings -> Environment variables -> Secrets (ADMIN_PASSWORD)
 */
import backend from '../../backend/src/worker';

export const onRequest: any = async (context: any) => {
  try {
    return await backend.fetch(context.request, context.env, context.ctx);
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
