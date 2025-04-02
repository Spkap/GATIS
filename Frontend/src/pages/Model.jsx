import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { generateImage } from '../api/api';

export default function Model() {
  const [inputText, setInputText] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = JSON.parse(
      localStorage.getItem('imageHistory') || '[]',
    );
    setHistory(savedHistory);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call the simplified API without authentication token
      const imageUrl = await generateImage(inputText);
      setGeneratedImage(imageUrl);

      // Update history
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
    link.download = `gatis-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Text to Image Synthesis</h1>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h2 className="text-xl font-semibold mb-2">About this Model</h2>
        <p>
          This model generates bird images based on text descriptions. Try
          describing a bird with details about its colors, features, or habitat.
        </p>
        <p className="mt-2">
          <strong>Example prompts:</strong> "A red bird with a black head", "A
          small blue bird in a forest setting", "A yellow bird with spotted
          wings"
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <Label htmlFor="inputText">Enter text description</Label>
          <Input
            id="inputText"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            required
            disabled={isLoading}
            placeholder="Describe a bird you want to generate..."
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
        {history.length === 0 ? (
          <p className="text-gray-500">
            No generated images yet. Try creating one!
          </p>
        ) : (
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
        )}
      </div>
    </div>
  );
}
