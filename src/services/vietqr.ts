export interface VietQRConfig {
  bankId: string;
  accountNo: string;
  accountName: string;
  template: 'compact' | 'compact2' | 'qr_only' | 'print';
}

export const DEFAULT_VIETQR_CONFIG: VietQRConfig = {
  bankId: '970422', // MB Bank
  accountNo: '888899998888',
  accountName: 'TIEM DO CHOI THE PHEO',
  template: 'compact2'
};

export const SUPPORTED_BANKS = [
  { id: '970422', name: 'MB Bank (Quân Đội)', shortName: 'MB' },
  { id: '970436', name: 'Vietcombank', shortName: 'VCB' },
  { id: '970407', name: 'Techcombank', shortName: 'TCB' },
  { id: '970432', name: 'VPBank', shortName: 'VPB' },
  { id: '970416', name: 'ACB', shortName: 'ACB' },
  { id: '970418', name: 'BIDV', shortName: 'BIDV' },
];

/**
 * Sinh link hình ảnh mã QR VietQR chuẩn ngân hàng Napas 247
 * Nội dung chuyển khoản được chuẩn hóa loại bỏ ký tự đặc biệt theo chuẩn Napas
 */
export function generateVietQRUrl(
  amount: number,
  orderCode: string,
  config: VietQRConfig = DEFAULT_VIETQR_CONFIG
): string {
  // Chuẩn hóa mã đơn cho hệ thống ngân hàng (chỉ chữ và số)
  const cleanCode = orderCode.replace(/[^a-zA-Z0-9]/g, '');
  const addInfo = encodeURIComponent(`THEPHEO ${cleanCode}`);
  const accountName = encodeURIComponent(config.accountName);
  return `https://img.vietqr.io/image/${config.bankId}-${config.accountNo}-${config.template}.png?amount=${Math.round(amount)}&addInfo=${addInfo}&accountName=${accountName}`;
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}
