export async function uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'codekumbh');
    formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
    formData.append('timestamp', String(Date.now() / 1000));
  
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/deum970q6/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to upload image. Please try again.');
    }
  
    const data = await response.json();
    return data.secure_url;
  }