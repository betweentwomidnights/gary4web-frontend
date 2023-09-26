import React from 'react';
import axios from 'axios';

interface AudioPlayerProps {
    audioUrl: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
    return (
        <div className="audio-player">
            <audio controls src={audioUrl}></audio>
            <a href={audioUrl} download="generated_audio.wav">Download</a>
            {/* Add share functionality here */}
        </div>
    );
};

export default AudioPlayer;