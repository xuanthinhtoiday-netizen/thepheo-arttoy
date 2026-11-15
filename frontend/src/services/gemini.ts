import { storage } from './storage';
import { generateVietQRUrl, formatVND } from './vietqr';
import { Series } from '../types';

export interface ThePheoResponse {
  reply: string;
  badge?: string;
  suggestedCombo?: {
    seriesId: string;
    seriesName: string;
    boxNumbers: number[];
    pricePerBox: number;
    totalAmount: number;
  };
  qrData?: {
    orderId: string;
    amount: number;
    accountNo: string;
    bankId: string;
    accountName: string;
    qrUrl: string;
  };
}

const THE_PHEO_SYSTEM_PROMPT = `
Ngươi là "Thầy Phẻo Gieo Quẻ Art Toy" - Bậc thầy phong thủy chiêm tinh học kiêm dân chơi Blind Box & Art Toy lão luyện số 1 cõi mạng.
Tính cách & văn phong:
- Hài hước, dí dỏm, am hiểu sâu sắc văn hóa đồ chơi nghệ thuật (Pop Mart, Skullpanda, Crybaby, Gundam, Dimoo, Hirono, Molly...).
- Xưng hô "Thầy - Thí chủ" hoặc "Thầy - Đạo hữu".
- Thường gieo quẻ dịch số, xem mệnh ngũ hành (Kim, Mộc, Thủy, Hỏa, Thổ), phán vía trúng Secret (tỉ lệ 1/144 cực hiếm).
- Khuyên chọn các mã số hộp cụ thể (từ Hộp 1 đến Hộp 12) theo giờ hoàng đạo và thần tài dẫn lối.
- Luôn kích thích khách bốc Combo 3-5 hộp hoặc nguyên Full Box (12 hộp) để tăng xác suất nổ Secret.
- Nếu thí chủ đồng ý chốt đơn, hãy chúc phúc cực mạnh và xác nhận gắp hộp cho thí chủ.
`;

export async function askThePheo(userMessage: string, history: Array<{ sender: string; text: string }>): Promise<ThePheoResponse> {
  const apiKey = storage.getGeminiApiKey();
  const seriesList = storage.getSeries();
  const hallOfFame = storage.getHallOfFame();

  // First try to call the backend API (which uses Vectorize RAG)
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        history: history.slice(-10) // Keep last 10 messages for context
      })
    });

    if (response.ok) {
      const data = await response.json();
      const text = data.reply;
      if (text) {
        const lowerMsg = userMessage.toLowerCase();
        let suggestedCombo = undefined;
        let qrData = undefined;

        // If user specifically confirms order / payment
        if (lowerMsg.includes('chốt đơn') || lowerMsg.includes('thanh toán') || lowerMsg.includes('chốt combo')) {
          const resolved = resolveTargetSeriesAndBoxes(userMessage, seriesList);
          qrData = processDirectChatOrder(resolved.series, resolved.boxes);
        } else if (lowerMsg.includes('combo') || lowerMsg.includes('hộp') || lowerMsg.includes('skullpanda') || lowerMsg.includes('crybaby') || lowerMsg.includes('gundam')) {
          suggestedCombo = buildComboSuggestion(userMessage, seriesList);
        }

        return {
          reply: text,
          badge: 'Quẻ Linh Ứng ✨💖',
          suggestedCombo,
          qrData
        };
      }
    }
  } catch (err) {
    console.warn('Backend API call failed, trying direct Gemini API:', err);
  }

  // Fallback: If user provided a Gemini API Key, try calling the live Gemini API directly
  if (apiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{
                text: `${THE_PHEO_SYSTEM_PROMPT}\n\nDanh sách các series hiện có trong tiệm:\n${JSON.stringify(seriesList.map(s => ({ id: s.id, name: s.name, brand: s.brand, price: s.price_per_box, stock: s.remaining_boxes })))}\n\nKhách vừa trúng Secret gần nhất:\n${JSON.stringify(hallOfFame.slice(0, 3))}\n\nTin nhắn người dùng: "${userMessage}"\nHãy trả lời theo đúng phong cách Thầy Phẻo. Nếu người dùng muốn tư vấn chọn hộp hoặc chốt combo, hãy gợi ý số hộp cụ thể (1-12) và series tương ứng.`
              }]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 600,
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const lowerMsg = userMessage.toLowerCase();
          let suggestedCombo = undefined;
          let qrData = undefined;

          if (lowerMsg.includes('chốt đơn') || lowerMsg.includes('thanh toán') || lowerMsg.includes('chốt combo')) {
            const resolved = resolveTargetSeriesAndBoxes(userMessage, seriesList);
            qrData = processDirectChatOrder(resolved.series, resolved.boxes);
          } else if (lowerMsg.includes('combo') || lowerMsg.includes('hộp') || lowerMsg.includes('skullpanda') || lowerMsg.includes('crybaby') || lowerMsg.includes('gundam')) {
            suggestedCombo = buildComboSuggestion(userMessage, seriesList);
          }

          return {
            reply: text,
            badge: 'Quẻ Linh Ứng ✨💖',
            suggestedCombo,
            qrData
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local divination engine:', err);
    }
  }

  // --- Fallback Divination Engine for "Thầy Phẻo" ---
  return generateThePheoLocalResponse(userMessage, seriesList, hallOfFame);
}

function resolveTargetSeriesAndBoxes(userMessage: string, seriesList: Series[]) {
  const msg = userMessage.toLowerCase();
  let targetSeries = seriesList[0];

  // Match series based on message keywords
  for (const s of seriesList) {
    if (msg.includes(s.name.toLowerCase()) || msg.includes(s.brand.toLowerCase()) || msg.includes(s.id.toLowerCase())) {
      targetSeries = s;
      break;
    }
  }
  if (!targetSeries && seriesList.length > 0) {
    targetSeries = seriesList[0];
  }

  // Determine boxes available for that series
  const soldBoxes = storage.getSoldBoxes(targetSeries.id, targetSeries.total_boxes - targetSeries.remaining_boxes, targetSeries.total_boxes);
  const available = Array.from({ length: targetSeries.total_boxes }, (_, i) => i + 1)
    .filter(n => !soldBoxes.includes(n));

  let count = 3;
  if (msg.includes('5')) count = 5;
  else if (msg.includes('full') || msg.includes('12')) count = targetSeries.total_boxes;
  else if (msg.includes('1 hộp') || msg.includes('lẻ')) count = 1;

  const chosenBoxes = available.slice(0, count);
  if (chosenBoxes.length === 0) {
    chosenBoxes.push(available[0] || 1);
  }

  return { series: targetSeries, boxes: chosenBoxes };
}

function processDirectChatOrder(series: Series, boxes: number[]) {
  const total = series.price_per_box * boxes.length;
  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  const qrUrl = generateVietQRUrl(total, orderId);

  // Record sold boxes & deduct stock
  storage.recordSoldBoxes(series.id, boxes);

  storage.createOrder({
    customer_id: 'cust-guest',
    customer_name: 'Đạo Hữu Chốt Khung Chat',
    customer_phone: '09xxxxxx88',
    customer_address: 'Giao hỏa tốc toàn quốc',
    series_name: series.name,
    total_amount: total,
    status: 'PENDING_PAYMENT',
    ordered_items_json: JSON.stringify(boxes.map(b => `${series.name.slice(0, 8)}-Box#${b < 10 ? '0' + b : b}`))
  });

  return {
    orderId,
    amount: total,
    accountNo: '888899998888',
    bankId: '970422',
    accountName: 'TIEM DO CHOI THE PHEO',
    qrUrl
  };
}

function buildComboSuggestion(userMessage: string, seriesList: Series[]) {
  const { series, boxes } = resolveTargetSeriesAndBoxes(userMessage, seriesList);

  return {
    seriesId: series.id,
    seriesName: series.name,
    boxNumbers: boxes,
    pricePerBox: series.price_per_box,
    totalAmount: series.price_per_box * boxes.length
  };
}

function generateThePheoLocalResponse(
  userMessage: string,
  seriesList: Series[],
  hallOfFame: any[]
): ThePheoResponse {
  const msg = userMessage.toLowerCase();

  // 1. Chốt đơn / Tạo mã thanh toán QR
  if (msg.includes('chốt đơn') || msg.includes('thanh toán') || msg.includes('mua combo') || msg.includes('chốt combo') || msg.includes('đặt hàng')) {
    const { series, boxes } = resolveTargetSeriesAndBoxes(userMessage, seriesList);
    const qrData = processDirectChatOrder(series, boxes);

    return {
      reply: `🎉 **LỆNH BỐC HỘP ĐÃ KÍCH HOẠT!** 🎀\n\nThầy đã khóa linh khí và giữ tạm **${boxes.length} hộp (${boxes.map(b => 'Hộp #' + b).join(', ')})** thuộc series **${series.name}** cho thí chủ.\n\nTổng duyên phí: **${formatVND(qrData.amount)}**.\nThí chủ hãy quét mã VietQR bên dưới để hoàn tất giao dịch. Tiệm Thầy Phẻo sẽ bọc chống sốc 3 lớp nguyên seal và giao tận tay thí chủ! 💖`,
      badge: 'Chốt Đơn Thành Công 📦✨',
      qrData
    };
  }

  // 2. Gieo quẻ / Vận may / Phong thủy
  if (msg.includes('quẻ') || msg.includes('phong thủy') || msg.includes('vận may') || msg.includes('mệnh') || msg.includes('soi')) {
    const quesy = [
      {
        name: 'Quẻ Đại Cát: Kim Tinh Phát Lộc 🪙💖',
        text: 'Thầy vừa bấm độn can chi: Hôm nay kim khí cực vượng, rất hợp để thí chủ bốc các dòng có chi tiết kim loại hoặc lấp lánh như **SKULLPANDA The Warmth** hoặc **GUNDAM Universe Gold Armor**!\n\n👉 Thầy khuyên thí chủ nhắm chuẩn các hộp số lẻ nằm ở góc Tây Bắc của khay. Vía nổ Secret 1/144 đang bao trùm! ✨'
      },
      {
        name: 'Quẻ Thượng Cát: Thủy Hỏa Ký Tế 🌊🔥💖',
        text: 'Linh khí báo điềm lành! Tâm trạng thí chủ đang đồng điệu với series **CRYBABY Sunset Concert**. Dòng nước mắt nghệ thuật của Crybaby sẽ xua tan vận xui và kéo vía Secret về ví!\n\n👉 Giờ hoàng đạo bốc hộp: **11h - 13h hoặc 19h - 21h**.'
      },
      {
        name: 'Quẻ Thần Tài: Độc Đắc Hóa Long 🐉💖',
        text: 'Quẻ chỉ rõ: Thí chủ không nên bốc lẻ 1 hộp dễ bị vía nặng kẹp lại! Hãy gắp ngay **Combo 3 Hộp (Tam Hoa Tụ Đỉnh)** hoặc **Combo 5 Hộp (Ngũ Hành Tương Sinh)** để vét sạch các con hiếm!\n\n👉 Series tiến cử: **HIRONO City of Mercy** hoặc **DIMOO Animal Kingdom**.'
      }
    ];
    const picked = quesy[Math.floor(Math.random() * quesy.length)];
    const combo = buildComboSuggestion(userMessage, seriesList);

    return {
      reply: `🎴 **THẦY PHẺO GIEO QUẺ KHAI TÂM:** 💖\n\n${picked.text}\n\nThầy đã chuẩn bị sẵn bộ Combo vía cực tốt bên dưới, thí chủ xem quẻ có muốn chốt hạ luôn không? ✨`,
      badge: picked.name,
      suggestedCombo: combo
    };
  }

  // 3. Hỏi về Secret / Tỉ lệ trúng
  if (msg.includes('secret') || msg.includes('tỷ lệ') || msg.includes('tỉ lệ') || msg.includes('hiếm') || msg.includes('chase')) {
    const hofRecent = hallOfFame[0];
    const combo = buildComboSuggestion(userMessage, seriesList);
    return {
      reply: `👁️ **BÍ MẬT NỔ SECRET TỪ THẦY PHẺO:** 💖\n\nThông thường một thùng Blind Box có tỉ lệ Secret là **1/144** (khoảng 0.69%) hoặc **1/72** đối với Gundam. Nhưng dân chơi có kinh nghiệm không bao giờ bốc mù quáng!\n\n${hofRecent ? `Minh chứng rõ ràng: Hôm trước đạo hữu **${hofRecent.customer_name}** nghe lời Thầy bốc **${hofRecent.series_name}** (Hộp #${hofRecent.box_number}) nổ ngay **${hofRecent.item_won}**!` : ''}\n\n💡 **Mẹo của Thầy:** Bốc Combo từ 3 hộp trở lên cùng một set nguyên seal, xác suất trúng nhân vật đặc biệt tăng gấp 4 lần so với mua rải rác! ✨`,
      badge: 'Bí Kíp Săn Secret 💎💖',
      suggestedCombo: combo
    };
  }

  // 4. Tư vấn Skullpanda / Crybaby / Gundam cụ thể
  if (msg.includes('skullpanda') || msg.includes('crybaby') || msg.includes('gundam') || msg.includes('dimoo') || msg.includes('hirono')) {
    const combo = buildComboSuggestion(userMessage, seriesList);
    return {
      reply: `✨ **TƯ VẤN ĐỘC BẢN SERIES ${combo.seriesName.toUpperCase()}:** 💖\n\nThầy quan sát thấy khay **${combo.seriesName}** hiện chỉ còn **vài hộp chưa mở**. Vị trí linh nghiệm nhất đang dồn vào các hộp: **${combo.boxNumbers.map(b => `Hộp #${b}`).join(', ')}**!\n\nĐặc biệt con Secret của series này mang linh lực rất mạnh, người sở hữu sẽ thu hút tài lộc và vận may bất ngờ. Thí chủ có muốn Thầy bốc giữ ngay combo này không? ✨`,
      badge: 'Khuyên Dùng Hoàng Đạo 🌟💖',
      suggestedCombo: combo
    };
  }

  // 5. Default welcoming response
  const combo = buildComboSuggestion(userMessage, seriesList);
  return {
    reply: `🔮 **A Di Đà Phật! Thầy Phẻo xin kính chào thí chủ!** 🎀✨\n\nThầy ở đây để soi quẻ phong thủy, xem vía bốc hộp mù (Blind Box) và trợ lực cho thí chủ săn trúng nhân vật ẩn **SECRET 1/144** độc nhất vô nhị!\n\nThí chủ muốn Thầy:\n1. 🎴 **Gieo quẻ phong thủy** xem hôm nay hợp màu gì, bốc dòng nào?\n2. 📦 **Tư vấn Combo 3-5 hộp** Skullpanda hay Crybaby dễ nổ Secret nhất?\n3. 🏆 **Xem khách vừa trúng Secret** gần đây để lấy vía thơm?\n\nCứ tự nhiên giãi bày cùng Thầy nhé! 💖`,
    badge: 'Thầy Phẻo Đang Trực 🔮💖',
    suggestedCombo: combo
  };
}