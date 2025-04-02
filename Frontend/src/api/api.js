const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const generateImage = async (prompt) => {
  try {
    const response = await fetch(`${API_URL}/generate-image/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: prompt,
      }),
    });

    if (!response.ok) {
      throw new Error('Image generation failed');
    }

    // Return image blob directly
    const imageBlob = await response.blob();
    return URL.createObjectURL(imageBlob);
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};
