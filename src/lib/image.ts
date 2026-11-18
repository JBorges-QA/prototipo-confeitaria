/**
 * Redimensiona e comprime uma imagem no navegador antes de salvar.
 * Na demonstração o resultado vira data URL; em produção, o mesmo arquivo
 * comprimido é enviado ao storage (Supabase Storage / Cloudinary / S3).
 */
export async function resizeImage(file: File, maxSize = 1000, quality = 0.8): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Selecione um arquivo de imagem.");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Não foi possível processar a imagem.");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", quality);
}
