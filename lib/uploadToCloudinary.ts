// lib/uploadToCloudinary.ts
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
    formData.append('resource_type', file.type.startsWith('video/') ? 'video' : 'image');
  
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${
      file.type.startsWith('video/') ? 'video' : 'image'
    }/upload`, {
      method: 'POST',
      body: formData,
    });
  
    if (!res.ok) {
      throw new Error('Cloudinary upload failed');
    }
  
    const data = await res.json();
    return data.secure_url;
  };
  