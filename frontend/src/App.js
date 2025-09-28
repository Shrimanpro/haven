import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Vent from './Vent';
import Journal from './Journal';
import Summaries from './Summaries';
import Iridescence from './components/Iridescence';
import GlassSurface from './components/GlassSurface';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './PageTransition';
import TargetCursor from './components/TargetCursor';

function App() {
  const [selectedEntry, setSelectedEntry] = useState(null);

  const handleEntryClick = (entry) => {
    setSelectedEntry(entry);
  };

  const location = useLocation();

  return (
    <div className="bg-black">
      <AnimatePresence exitBeforeEnter>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><MainMenu /></PageTransition>} />
          <Route path="/vent" element={<PageTransition><Vent /></PageTransition>} />
          <Route path="/journal" element={<PageTransition><Journal selectedEntry={selectedEntry} handleEntryClick={handleEntryClick} /></PageTransition>} />
          <Route path="/summaries" element={<PageTransition><Summaries /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

const MainMenu = () => {
  const [animationState, setAnimationState] = useState('idle');
  const [breathCount, setBreathCount] = useState(0);

  useEffect(() => {
    if (animationState === 'idle' || animationState === 'finished') return;

    if (breathCount >= 5) {
      setAnimationState('finished');
      return;
    }

    const breathCycle = {
      breathingIn: 'holdingAfterInhale',
      holdingAfterInhale: 'breathingOut',
      breathingOut: 'holdingAfterExhale',
      holdingAfterExhale: 'breathingIn',
    };

    const nextState = breathCycle[animationState];

    const timeouts = {
      breathingIn: 2000,
      holdingAfterInhale: 1000,
      breathingOut: 2000,
      holdingAfterExhale: 1000,
    };

    const timeout = setTimeout(() => {
      setAnimationState(nextState);
      if (animationState === 'holdingAfterExhale') {
        setBreathCount(breathCount + 1);
      }
    }, timeouts[animationState]);

    return () => clearTimeout(timeout);
  }, [animationState, breathCount]);

  const getBreathText = () => {
    if (animationState === 'breathingIn') return 'Breathe In';
    if (animationState === 'breathingOut') return 'Breathe Out';
    if (animationState === 'idle' || animationState === 'finished') return 'Meditate';
    return '';
  };

  const getAnimationClass = () => {
    if (animationState === 'breathingIn' || animationState === 'holdingAfterInhale') return 'animate-pulse-grow';
    if (animationState === 'breathingOut' || animationState === 'holdingAfterExhale') return 'animate-pulse-shrink';
    return '';
  };

  const handleButtonClick = () => {
    if (animationState === 'idle' || animationState === 'finished') {
      setAnimationState('breathingIn');
      setBreathCount(0);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
  <TargetCursor 

        spinDuration={2}

        hideDefaultCursor={true}

      />
  {/* Background */}
  <Iridescence
    color={[0.6, 0.6, 0.6]}
    mouseReact={false}
    amplitude={0.1}
    speed={1.0}
    className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
  />

  {/* Foreground content */}
  <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-8">
    <h1 className='z-10 font-atop text-9xl font-bold text-white'>
        <span style={{ textShadow: '0 0 10px black' }}>Haven</span></h1>
    {/* Main button */}
    <div
      className={`cursor-target flex items-center justify-center w-64 h-64 rounded-full from-blue-400 to-blue-600 cursor-pointer transition-transform duration-2000 shadow-lg ${getAnimationClass()}`}
      onClick={handleButtonClick}
    >
      <GlassSurface
  width={250}
  height={250}
  borderRadius={10004}
  className="flex items-center justify-center"
>
      <span className="font-atop text-3xl font-bold text-blue-400" style={{ textShadow: '0 0 4px black' }}>{getBreathText()}</span>
</GlassSurface>
    </div>


    {/* Buttons grid */}
    <div className="grid gap-4 ">
  <Link
    to="/vent"
    className="cursor-target font-atop text-green-400 hover:text-green-700 font-bold text-3xl"
  >
      <GlassSurface
  width={200}
  height={50}
  borderRadius={24}
  className="flex items-center justify-center"
>
    <span style={{ textShadow: '0 0 4px black' }}>Vent</span>
</GlassSurface>
  </Link>
      <Link
        to="/journal"
        className="cursor-target font-atop font-light text-yellow-300 hover:text-yellow-700 rounded-full text-center text-3xl"
      >
      <GlassSurface
  width={200}
  height={50}
  borderRadius={24}
  className="flex items-center justify-center"
>
        <span style={{ textShadow: '0 0 4px black' }}>Journal</span>
        </GlassSurface>
      </Link>
      <Link
        to="/summaries"
        className="cursor-target font-atop text-purple-400 hover:text-purple-700 font-bold rounded-full text-center text-3xl"
      >
      <GlassSurface
  width={200}
  height={50}
  borderRadius={24}
  className="flex items-center justify-center"
>
        <span style={{ textShadow: '0 0 4px black' }}>Insights</span>
        </GlassSurface>
      </Link>
    </div>
  </div>
</div>
  );
};

const Root = () => {
  return (
    <Router>
      <App />
    </Router>
  )
}

export default Root;