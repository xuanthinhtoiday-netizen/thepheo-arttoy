/**
 * Middleware Hono: bat thong tin truy cap moi request GET va gui len Basin stream
 * sau khi xu ly xong trang (dung waitUntil de khong lam cham trang web).
 *
 * Can cau hinh bien moi truong BASIN_INGEST_URL (va tuych chon BASIN_GROUP_ID)
 * de hoat dong. Neu bo trong => khong gui du lieu nao.
 */

import { Context, Next } from 'hono';
import { sendToBasin, TrafficEvent } from '../utils/basinStream';

function detectDevice(ua: string): string {
  if (/tablet|ipad/i.test(ua)) return 'Tablet';
  if (/mobile|android|iphone/i.test(ua)) return 'Mobile';
  return 'Desktop';
}

export interface BasinConfig {
  groupId?: string;
}

export const basinTracking = (config: BasinConfig = {}) => {
  return async (c: Context, next: Next) => {
    await next();

    if (c.req.method !== 'GET') return;

    const env = c.env as any;
    const url = env?.BASIN_INGEST_URL;
    const groupId = env?.BASIN_GROUP_ID || config.groupId || 'arttoy';
    if (!url) return;

    const event: TrafficEvent = {
      id: groupId,
      country: c.req.header('CF-IPCountry') || 'UNKNOWN',
      device: detectDevice(c.req.header('User-Agent') || ''),
      time: Date.now(), // Mili-giay (13 chu so) - phai lay dung nhu nay de bo loc 24h khong bi loi
      ip: c.req.header('CF-Connecting-IP') || '0.0.0.0',
      // Neu frontend gui ?path=/... (trang SPA thuc te) thi uu tien, khong thi lay pathname
      meta: { path: c.req.query('path') || new URL(c.req.url).pathname },
    };

    const promise = sendToBasin(env, event);

    // Chay nen sau tra loi, khong lam chot trinh duyet
    try {
      c.executionCtx?.waitUntil(promise);
    } catch {
      // Local dev / Pages khong co executionCtx -> chay thang
      await promise.catch(() => {});
    }
  };
};
