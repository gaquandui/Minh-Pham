
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MODEL_NAME_IMAGE_GENERATION, ASPECT_RATIO_9_16 } from '../constants';

interface GenerateImageOptions {
  parts: any[];
}

export const generateImage = async ({ parts }: GenerateImageOptions): Promise<{url?: string, text?: string, error?: string}> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME_IMAGE_GENERATION,
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: ASPECT_RATIO_9_16,
        },
      },
    });

    const candidate = response.candidates?.[0];
    
    if (candidate?.finishReason === 'SAFETY') {
      return { error: "Nội dung bị chặn bởi bộ lọc an toàn (Safety). Vui lòng kiểm tra lại trang phục hoặc tư thế." };
    }

    if (!candidate?.content?.parts || candidate.content.parts.length === 0) {
      return { error: "Mô hình không trả về dữ liệu. Có thể do yêu cầu quá phức tạp hoặc bị lọc nội dung." };
    }

    let foundImage = false;
    let responseText = "";

    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        foundImage = true;
        return { url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` };
      }
      if (part.text) {
        responseText += part.text;
      }
    }
    
    if (!foundImage && responseText) {
      return { text: responseText, error: "AI chỉ trả về văn bản, không tạo được ảnh. Lý do: " + responseText };
    }

    return { error: "Không tìm thấy dữ liệu ảnh trong phản hồi từ AI." };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes('429')) return { error: "Tốc độ yêu cầu quá nhanh. Vui lòng đợi 1 phút." };
    if (error.message?.includes('400')) return { error: "Yêu cầu không hợp lệ. Hãy thử giảm bớt độ phức tạp của ảnh." };
    return { error: error.message || "Lỗi kết nối máy chủ AI." };
  }
};
