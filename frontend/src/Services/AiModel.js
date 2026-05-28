// USE THIS INSTEAD
import axios from 'axios';

const handleGenerateAI = async () => {
  setLoading(true);
  try {
    const result = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/ai/generate-content`, {
      prompt: "Write a professional summary for...", // Your specific prompt
      type: 'summary' // or 'experience'
    });
    setSummary(result.data.content);
  } catch (error) {
    console.error("AI Generation failed");
  } finally {
    setLoading(false);
  }
};