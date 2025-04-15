export const uploadToCloudinary = async (
  file: File,
  folder = 'portfolio'
): Promise<string> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', folder);

  const resourceType = file.type === 'application/pdf'
    ? 'raw'
    : file.type.startsWith('video/')
    ? 'video'
    : 'image';

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error('Cloudinary upload failed:', errText);
      throw new Error('Cloudinary upload failed');
    }

    const data = await res.json();
    console.log('✅ Cloudinary upload successful:', data.secure_url);
    return data.secure_url;
  } catch (err) {
    console.error('❌ Upload error:', err);
    throw err;
  }
};
