import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Iridescence from './components/Iridescence';
import GlassSurface from './components/GlassSurface';
import PageTransition from './PageTransition';
import TargetCursor from './components/TargetCursor';

const Vent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);

  // Web Speech API setup
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript); // put transcript in input box
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleSend = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { text: input, sender: 'user' }];
      setMessages(newMessages);
      const currentInput = input;
      setInput('');

      const response = await fetch('http://localhost:5000/api/vent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
      });
      const data = await response.json();
      setMessages([...newMessages, { text: data.response, sender: 'bot' }]);
    }
  };

  const handleMicClick = () => {
    if (recognitionRef.current) {
      if (!listening) {
        setListening(true);
        recognitionRef.current.start();
      } else {
        recognitionRef.current.stop();
        setListening(false);
      }
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col h-screen bg-gradient-to-br from-red-400 via-orange-500 to-purple-600 text-white">
  <TargetCursor 

        spinDuration={2}

        hideDefaultCursor={true}

      />
        <Iridescence
          color={[0.6, 0.9, 0.6]}
          mouseReact={false}
          amplitude={0.1}
          speed={1.0}
          className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
        />

        {/* Chat Messages */}
        <div className="z-10 flex-grow p-4 overflow-y-auto bg-gray-800 bg-opacity-50 rounded-lg m-4 ">
          <div className="flex flex-col gap-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-s ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white self-end text-2xl font-bold'
                    : 'bg-gray-700 text-white self-start text-2xl font-bold'
                }`}>
                {message.text}
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="z-10 p-4 flex items-center gap-2">
          <input
            type="text"
            className="flex-grow border rounded-full p-5 bg-gray-700 text-white font-atop text-2xl cursor-target"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            className="text-blue-500 hover:text-blue-700 font-atop py-2 px-4 rounded-full text-5xl cursor-target"
            onClick={handleSend}>
        <GlassSurface
    width={200}
    height={50}
    borderRadius={24}
    className="flex items-center justify-center"
  >
          <span style={{ textShadow: '0 0 4px black' }}>Send</span>
          </GlassSurface>
          </button>
          <button
            className={`ml-1 px-1 py-1 rounded-full font-bold cursor-target${
              listening ? 'text-red-500 animate-pulse' : 'bg-green-500 hover:bg-green-700'
            }`}
            onClick={handleMicClick}>
        <GlassSurface
    width={50}
    height={50}
    borderRadius={24}
    className="flex items-center justify-center"
  >
          <span style={{ textShadow: '0 0 4px black' }}>🎤</span>
          </GlassSurface>
          </button>
        </div>
        <Link
          to="/"
          className="z-10 mt-8 text-gray-100 hover:text-gray-400 font-bold rounded self-center mb-4 font-atop text-3xl cursor-target"
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
    </PageTransition>
  );
};

export default Vent;