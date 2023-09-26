import React, { useState, FormEvent } from 'react';
import axios from 'axios';

interface AudioFormProps {
    onAudioGenerated: (url: string) => void;
}

const AudioForm: React.FC<AudioFormProps> = ({ onAudioGenerated }) => {
    const [file, setFile] = useState<File | null>(null);
    const [bpm, setBpm] = useState<string>("");
    const [duration, setDuration] = useState<string>("5");
    const [iterations, setIterations] = useState<string>("7");
    const [outputDurationRange, setOutputDurationRange] = useState<string>("20-30");

    function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // The result contains the text "data:audio/wav;base64," followed by the Base64-encoded data.
      // Split off the prefix to get just the Base64 data.
      const base64String = reader.result?.toString().split(',')[1];
      resolve(base64String || "");
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
}

    const handleSubmit = async (event: FormEvent) => {
  event.preventDefault();

  if (!file) {
    console.error('No file selected');
    return;
  }

  try {
    const audioBase64 = await fileToBase64(file);
    const data = {
      audioBase64,
      bpm,
      duration,
      iterations,
      outputDurationRange
    };

    const response = await axios.post('/api/generateAudio', data, {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'arraybuffer',
    });

    const blob = new Blob([response.data], { type: 'audio/wav' });
    const url = window.URL.createObjectURL(blob);
    onAudioGenerated(url);
  } catch (error) {
    console.error('Error generating audio:', error);
  }
};

return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="p-6 rounded shadow-lg bg-white">
        <h1 className="text-2xl font-bold mb-4">Generate Audio</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Upload Audio</label>
            <input type="file" accept=".wav" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} className="mt-1 p-2 w-full border rounded-md"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">BPM</label>
            <input type="text" placeholder="BPM" value={bpm} onChange={(e) => setBpm(e.target.value)} className="mt-1 p-2 w-full border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Prompt Duration</label>
            <input type="text" placeholder="Prompt Duration" value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-1 p-2 w-full border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Iterations</label>
            <input type="text" placeholder="Iterations" value={iterations} onChange={(e) => setIterations(e.target.value)} className="mt-1 p-2 w-full border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Output Duration Range</label>
            <input type="text" placeholder="Output Duration Range" value={outputDurationRange} onChange={(e) => setOutputDurationRange(e.target.value)} className="mt-1 p-2 w-full border rounded-md" />
          </div>
          <div>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200">
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AudioForm;
