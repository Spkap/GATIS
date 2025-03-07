import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function Model() {
  const [inputText, setInputText] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const savedHistory = JSON.parse(localStorage.getItem('imageHistory') || '[]');
    setHistory(savedHistory);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const mockImageUrl = `/images/placeholder-${Math.floor(Math.random() * 5) + 1}.jpg`;
    setGeneratedImage(mockImageUrl);
    
    const newHistoryItem = {
      id: Date.now(),
      inputText,
      imageUrl: mockImageUrl,
      createdAt: new Date().toISOString()
    };
    
    const updatedHistory = [newHistoryItem, ...history];
    localStorage.setItem('imageHistory', JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'generated-image.jpg';
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
          />
        </div>
        <Button type="submit">Generate Image</Button>
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
