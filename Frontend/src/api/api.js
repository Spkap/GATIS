const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const loginUser = async (username, password) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  const response = await fetch(`${API_URL}/token`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
};

export const signupUser = async (username, email, password) => {
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || 'Signup failed');
  }

  return response.json();
};

export const generateImage = async (prompt, token) => {
  try {
    const response = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Image generation failed');
    }

    return response.json();
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

export const getImageUrl = (imagePath) => {
  const filename = imagePath.startsWith('/images/')
    ? imagePath.replace('/images/', '')
    : imagePath;
  return `${API_URL}/images/${filename}`;
};
