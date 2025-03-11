import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { generateImage, getImageUrl } from '../api/api'; 

export default function Model() {
  const [inputText, setInputText] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const authToken = localStorage.getItem('authToken');

    if (!isAuthenticated || !authToken) {
      navigate('/login');
      return;
    }

    const savedHistory = JSON.parse(
      localStorage.getItem('imageHistory') || '[]',
    );
    setHistory(savedHistory);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        throw new Error('Authentication token not found');
      }

      const response = await generateImage(inputText, authToken);

      console.log('Generation response:', response);


      const imagePathOrUrl = response.image_url;

      const imageUrl = getImageUrl(imagePathOrUrl);

      setGeneratedImage(imageUrl);

      const newHistoryItem = {
        id: Date.now(),
        inputText,
        imageUrl,
        timestamp: new Date().toISOString(),
      };

      const updatedHistory = [newHistoryItem, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('imageHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Generation failed:', error);
      alert(`Failed to generate image: ${error.message || 'Please try again'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `gatis-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">GA-TIS Model</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <Label htmlFor="inputText">Enter text description</Label>
          <Input
            id="inputText"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Image'}
        </Button>
      </form>

      {generatedImage && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Generated Image</h2>
          <img
            src={generatedImage}
            alt="Generated"
            className="mb-4 w-full max-w-lg h-auto"
          />
          <Button onClick={handleDownload}>Download Image</Button>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold mb-4">History</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {history.map((item) => (
            <div key={item.id} className="border p-4 rounded">
              <img
                src={item.imageUrl}
                alt="Generated"
                className="w-full h-auto"
              />
              <p className="mt-2 text-sm truncate">{item.inputText}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
