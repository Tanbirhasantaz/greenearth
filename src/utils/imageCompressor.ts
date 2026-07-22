export async function compressImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve('');
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => resolve('');
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        resolve('');
        return;
      }

      const img = new Image();
      img.onerror = () => resolve(src);
      img.onload = () => {
        try {
          let { width, height } = img;

          // Scale dimensions if larger than max
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(src);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Convert to compressed JPEG data URL
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (err) {
          console.error("Canvas image compression error, using original src:", err);
          resolve(src);
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}
