/**
 * Basin traffic stream client cho dự án Art Toy Mystery Box.
 *
 * Gom 6 thông tin truy cập (id nhóm, quốc gia, thiết bị, thời gian, IP, trang đang mở)
 * rồi bắn lên endpoint ingest của thầy/giáo viên. Mặc định BASIN_INGEST_URL = ''
 * => không gửi gì cả (không làm ảnh hưởng đến trang web).
 *
 * Dữ liệu được gửi dưới dạng mảng JSON vì endpoint chỉ nhận dạng mảng.
 */

export interface TrafficEvent {
  id: string;
  country: string;
  device: string;
  time: number;
  ip: string;
  meta: Record<string, unknown>;
}

export async function sendToBasin(env: any, event: TrafficEvent): Promise<void> {
  const url = env?.BASIN_INGEST_URL;
  if (!url) {
    // Chưa cấu hình endpoint -> bo qua, khong lam gi
    return;
  }
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([event]), // Phai co ngoai vuong ngoai cung vi endpoint chi nhan mang
    });
  } catch (e) {
    console.error('Basin stream error:', e);
  }
}
