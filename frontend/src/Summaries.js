import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { marked } from 'marked';
import Iridescence from './components/Iridescence';
import GlassSurface from './components/GlassSurface';
import TargetCursor from './components/TargetCursor';

const Summaries = () => {
  const [summary, setSummary] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      const response = await fetch('http://localhost:5000/api/summaries');
      const data = await response.json();
      setSummary(data.response);
    };
    fetchSummary();
  }, []);

  return (
    <div className="flex flex-col items-center h-screen bg-gradient-to-br from-red-400 via-orange-500 to-purple-600 text-white p-4">
  <TargetCursor 

        spinDuration={2}

        hideDefaultCursor={true}

      />
  <Iridescence
    color={[0.7, 0.5, 0.9]}
    mouseReact={false}
    amplitude={0.1}
    speed={1.0}
    className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
  />
      <h1 className="z-10 text-3xl font-bold mb-4 font-atop">
    <span style={{ textShadow: '0 0 4px black' }}>Journal Insights</span></h1>
      <div 
        className="z-10 bg-gray-800 p-8 rounded-lg shadow-lg max-w prose prose-invert prose-strong:text-5xl prose:text-2xl custom-prose"
        dangerouslySetInnerHTML={{ __html: marked(summary) }}
      />
        <Link
          to="/"
          className="cursor-target z-10 mt-8 text-gray-100 hover:text-gray-400 font-bold rounded self-center mb-4 font-atop text-3xl"
        >
        <GlassSurface
    width={500}
    height={50}
    borderRadius={24}
    className="flex items-center justify-center"
  >
          <span style={{ textShadow: '0 0 4px black' }}>Back to Menu</span>
          </GlassSurface>
        </Link>
    </div>
  );
};

export default Summaries;