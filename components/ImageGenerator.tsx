
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { 
  DEFAULT_CHARACTER_APPEARANCE, 
  STRICT_THREE_QUARTER_BODY_COMPOSITION_INSTRUCTION,
  FULL_BODY_EXPANSION_INSTRUCTION,
  STRICT_BACKGROUND_PRESERVATION_INSTRUCTION,
  STRICT_OUTFIT_LOCK_INSTRUCTION,
  EXTREME_CLOTHING_COPY_INSTRUCTION,
  UNTUCKED_STYLE_INSTRUCTION,
  RANDOM_POSE_OPTIONS,
  STRAIGHT_FORWARD_POSE_INSTRUCTION,
  CRITICAL_WATERMARK_REMOVAL_INSTRUCTION
} from '../constants';
import { LoadingSpinner } from './LoadingSpinner';

export const ImageGenerator: React.FC = () => {
  const [posePrompt, setPosePrompt] = useState<string>('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isRandomPoseEnabled, setIsRandomPoseEnabled] = useState<boolean>(false);
  const [isUntucked, setIsUntucked] = useState<boolean>(true); 
  const [selectedBodyRatio, setSelectedBodyRatio] = useState<'3/4' | 'full'>('full');
  
  const [uploadedClothingImage, setUploadedClothingImage] = useState<{ data: string; mimeType: string; } | null>(null);
  const [uploadedCharacterImage, setUploadedCharacterImage] = useState<{ data: string; mimeType: string; } | null>(null);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>, 
    setFunction: React.Dispatch<React.SetStateAction<{ data: string; mimeType: string; } | null>>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const parts = base64String.split(';base64,');
        if (parts.length === 2) {
          setFunction({ data: parts[1], mimeType: parts[0].replace('data:', '') });
          setError(null);
        }
      };
      reader.readAsDataURL(file);
    } 
    event.target.value = '';
  };

  const clearImage = (setFunction: React.Dispatch<React.SetStateAction<{ data: string; mimeType: string; } | null>>) => setFunction(null);

  const handleGenerateImage = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    const parts: any[] = [];
    
    if (uploadedCharacterImage) {
      parts.push({ text: "IMAGE 1 (SOURCE FOR FACE AND BACKGROUND):" });
      parts.push({ inlineData: uploadedCharacterImage });
    }

    if (uploadedClothingImage) {
      parts.push({ text: "IMAGE 2 (EXACT CLOTHING STYLE, LENGTH, AND FIT TO REPLICATE):" });
      parts.push({ inlineData: uploadedClothingImage });
    }

    const poseText = isRandomPoseEnabled 
      ? RANDOM_POSE_OPTIONS[Math.floor(Math.random() * RANDOM_POSE_OPTIONS.length)]
      : (posePrompt.trim() || STRAIGHT_FORWARD_POSE_INSTRUCTION);

    let instruction = `**OBJECTIVE: ABSOLUTE CLOTHING REPLICATION WITH CORRECT PROPORTIONS**\n\n`;
    
    if (uploadedCharacterImage) {
      instruction += `1. **CHARACTER IDENTITY:** Keep the exact face and skin tone from IMAGE 1.\n`;
      instruction += `2. **SCENE:** ${STRICT_BACKGROUND_PRESERVATION_INSTRUCTION}\n`;
      
      if (uploadedClothingImage) {
        instruction += `3. **OUTFIT REPLICATION:** ${EXTREME_CLOTHING_COPY_INSTRUCTION}\n`;
        instruction += `   - **IMPORTANT:** Measure the length of the outfit in IMAGE 2 against the body and replicate that exact proportion on the character. If it is a mini-skirt, keep it mini. If it is a long gown, keep it floor-length.\n`;
        if (isUntucked) {
          instruction += `4. **STYLING:** ${UNTUCKED_STYLE_INSTRUCTION}\n`;
        }
      } else {
        instruction += `3. **OUTFIT PRESERVATION:** ${STRICT_OUTFIT_LOCK_INSTRUCTION}\n`;
      }

      if (selectedBodyRatio === 'full') {
        instruction += `5. **VIEWPORT:** ${FULL_BODY_EXPANSION_INSTRUCTION}\n`;
      } else {
        instruction += `5. **VIEWPORT:** ${STRICT_THREE_QUARTER_BODY_COMPOSITION_INSTRUCTION}\n`;
      }
    } else {
      instruction += DEFAULT_CHARACTER_APPEARANCE;
    }

    instruction += `\n**POSE:** ${poseText}\n`;
    instruction += `\n**QUALITY:** Photorealistic, professional photography, high resolution. ${CRITICAL_WATERMARK_REMOVAL_INSTRUCTION}`;

    parts.push({ text: instruction });

    try {
      const result = await generateImage({ parts });
      if (result.error) setError(result.error);
      else if (result.url) setGeneratedImages([result.url]);
    } catch (err: any) {
      setError("Đã xảy ra lỗi hệ thống. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
          Idol Character Master
        </h1>
        <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-[0.3em]">Sao chép trang phục & Tỉ lệ độ dài tuyệt đối</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-white p-7 rounded-3xl border border-gray-100 shadow-2xl space-y-6">
           <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">1. Ảnh Gốc (Mặt & Nền)</label>
                {!uploadedCharacterImage ? (
                  <label className="flex flex-col items-center justify-center h-0 pt-[133.33%] relative border-2 border-dashed border-gray-100 rounded-2xl cursor-pointer hover:border-indigo-300 transition-all">
                    <span className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                        <span className="text-2xl mb-1">👤</span>
                        <span className="text-[9px] text-gray-400 font-bold uppercase">Tải Ảnh Gốc</span>
                    </span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setUploadedCharacterImage)} />
                  </label>
                ) : (
                  <div className="relative w-full h-0 pt-[133.33%] rounded-2xl overflow-hidden border-2 border-indigo-500 shadow-lg group">
                    <img src={`data:${uploadedCharacterImage.mimeType};base64,${uploadedCharacterImage.data}`} className="absolute inset-0 w-full h-full object-cover" alt="Source" />
                    <button onClick={() => clearImage(setUploadedCharacterImage)} className="absolute top-2 right-2 bg-black/60 text-white w-6 h-6 rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                    <div className="absolute bottom-0 inset-x-0 bg-indigo-600 text-white text-[8px] font-bold py-1 text-center uppercase">Face Locked</div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">2. Ảnh Đồ (Độ dài & Kiểu dáng)</label>
                {!uploadedClothingImage ? (
                  <label className="flex flex-col items-center justify-center h-0 pt-[133.33%] relative border-2 border-dashed border-gray-100 rounded-2xl cursor-pointer hover:border-purple-300 transition-all">
                    <span className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                        <span className="text-2xl mb-1">👗</span>
                        <span className="text-[9px] text-gray-400 font-bold uppercase">Tải Ảnh Đồ</span>
                    </span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setUploadedClothingImage)} />
                  </label>
                ) : (
                  <div className="relative w-full h-0 pt-[133.33%] rounded-2xl overflow-hidden border-2 border-purple-500 shadow-lg group">
                    <img src={`data:${uploadedClothingImage.mimeType};base64,${uploadedClothingImage.data}`} className="absolute inset-0 w-full h-full object-cover" alt="Outfit" />
                    <button onClick={() => clearImage(setUploadedClothingImage)} className="absolute top-2 right-2 bg-black/60 text-white w-6 h-6 rounded-full text-[10px] flex items-center justify-center">✕</button>
                    <div className="absolute bottom-0 inset-x-0 bg-purple-600 text-white text-[8px] font-bold py-1 text-center uppercase">Outfit Proportion</div>
                  </div>
                )}
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                 <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-700">Kiểu mặc: Áo bỏ ngoài (Untucked)</span>
                    <span className="text-[9px] text-gray-400 font-medium italic">Không sơ vin vào quần/váy</span>
                 </div>
                 <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${isUntucked ? 'bg-indigo-600' : 'bg-gray-300'}`} onClick={() => setIsUntucked(!isUntucked)}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isUntucked ? 'translate-x-6' : 'translate-x-0'}`}></div>
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase">Góc chụp</label>
                <div className="flex gap-2">
                    <button onClick={() => setSelectedBodyRatio('3/4')} className={`flex-1 py-3 text-[10px] font-black rounded-xl border-2 transition-all uppercase tracking-widest ${selectedBodyRatio === '3/4' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-400 border-gray-50'}`}>Cận Đùi</button>
                    <button onClick={() => setSelectedBodyRatio('full')} className={`flex-1 py-3 text-[10px] font-black rounded-xl border-2 transition-all uppercase tracking-widest ${selectedBodyRatio === 'full' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-400 border-gray-50'}`}>Toàn Thân</button>
                </div>
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                 <span className="text-[10px] font-black text-gray-400 uppercase">Tư thế / Hành động</span>
                 <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-[10px] text-gray-500 font-bold">Ngẫu nhiên</span>
                    <input type="checkbox" checked={isRandomPoseEnabled} onChange={() => setIsRandomPoseEnabled(!isRandomPoseEnabled)} className="w-4 h-4 accent-indigo-600" />
                 </label>
              </div>

              {!isRandomPoseEnabled && (
                <textarea 
                    value={posePrompt} 
                    onChange={(e) => setPosePrompt(e.target.value)} 
                    placeholder="Mô tả tư thế (ví dụ: đang đi bộ, cầm điện thoại...)" 
                    className="w-full p-4 text-sm border-2 border-gray-50 rounded-2xl bg-white h-24 focus:border-indigo-100 outline-none transition-all resize-none shadow-inner" 
                />
              )}
           </div>

           <button 
                onClick={handleGenerateImage} 
                disabled={isLoading} 
                className="w-full py-5 bg-gray-900 text-white font-black rounded-2xl shadow-xl active:scale-[0.98] disabled:opacity-50 transition-all uppercase tracking-widest text-xs"
           >
            {isLoading ? <LoadingSpinner className="w-5 h-5 border-white" /> : 'BẮT ĐẦU TẠO IDOL'}
           </button>
          
          {error && <div className="p-4 bg-red-50 text-[10px] text-red-600 font-bold rounded-xl border border-red-100">{error}</div>}
        </div>

        <div className="lg:col-span-7 flex justify-center">
           <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl w-full max-w-[380px] overflow-hidden ring-[12px] ring-gray-50/50">
             <div className="relative bg-white flex flex-col items-center justify-center min-h-[660px]">
                {isLoading ? (
                  <div className="flex flex-col items-center gap-6 text-center p-10">
                     <LoadingSpinner className="w-12 h-12 text-indigo-600" />
                     <p className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.2em] animate-pulse">Đang đo tỉ lệ trang phục...</p>
                  </div>
                ) : generatedImages.length > 0 ? (
                  <div className="w-full p-3 space-y-4 animate-in fade-in zoom-in duration-500">
                     <img src={generatedImages[0]} alt="Result" className="w-full rounded-[2.5rem] shadow-2xl border border-gray-50" />
                     <button onClick={() => {
                        const link = document.createElement('a');
                        link.href = generatedImages[0];
                        link.download = `idol_an_${Date.now()}.png`;
                        link.click();
                     }} className="w-full py-4 bg-indigo-600 text-white text-[10px] font-black rounded-2xl shadow-lg uppercase tracking-widest hover:bg-indigo-700 transition-colors">Lưu ảnh TikTok</button>
                  </div>
                ) : (
                  <div className="text-center p-12 space-y-5 opacity-30">
                    <span className="text-4xl block">✨</span>
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">Preview 9:16</p>
                  </div>
                )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
