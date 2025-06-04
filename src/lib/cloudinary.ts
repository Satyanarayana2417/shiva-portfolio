
interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'portfolio');

  try {
    const response = await fetch(
      'https://api.cloudinary.com/v1_1/doxwyrp8n/image/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data: CloudinaryUploadResult = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};
