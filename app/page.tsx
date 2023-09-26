'use client';

import React, { useState } from 'react';
import AudioForm from './components/AudioForm';
import AudioPlayer from './components/AudioPlayer';
import axios from 'axios';

const Home: React.FC = () => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleAudioGenerated = (generatedAudioUrl: string) => {
    setAudioUrl(generatedAudioUrl);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/2 p-6">
        <AudioForm onAudioGenerated={handleAudioGenerated} />
      </div>
      <div className="w-1/2 p-6">
        {audioUrl && <AudioPlayer audioUrl={audioUrl} />}
      </div>
    </div>
  );
};

export default Home;
