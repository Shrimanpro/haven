import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JournalEntry from './JournalEntry';
import GlassSurface from './components/GlassSurface';
import Iridescence from './components/Iridescence';
import PageTransition from './PageTransition';
import TargetCursor from './components/TargetCursor';

const Journal = ({ selectedEntry, handleEntryClick }) => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');

  useEffect(() => {
    const fetchEntries = async () => {
      const response = await fetch('http://localhost:5000/api/journals');
      const data = await response.json();
      setEntries(data);
    };
    fetchEntries();
  }, []);

  const handleNewEntry = () => {
    handleEntryClick(null);
    setNewEntry('');
  };

  const handleSubmit = async () => {
    const res = await fetch('http://localhost:5000/api/journal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entry: newEntry }),
    });
    const data = await res.json();
    setEntries([data, ...entries]);
    handleEntryClick(data);
    setNewEntry('');
  };

  const handleDelete = async (timestamp) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      const res = await fetch(`http://localhost:5000/api/journal/${timestamp}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setEntries(entries.filter((entry) => entry.timestamp !== timestamp));
        if (selectedEntry && selectedEntry.timestamp === timestamp) {
          handleEntryClick(null);
        }
      }
    }
  };

  return (
    <PageTransition>
      <div className="flex h-screen bg-gradient-to-br from-red-400 via-orange-500 to-purple-600 text-white">
  <TargetCursor 

        spinDuration={2}

        hideDefaultCursor={true}

      />
        <Iridescence
          color={[0.8, 0.7, 0.4]}
          mouseReact={false}
          amplitude={0.1}
          speed={1.0}
          className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
        />
        <div className="z-10 w-1/5 bg-gray-800 p-4 overflow-y-auto">
          <button 
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 cursor-target"
            onClick={handleNewEntry}
          >
            New Entry
          </button>
          <h2 className="text-xl font-bold mb-4">Past Entries</h2>
          <div>
            {entries.map((entry, index) => (
              <JournalEntry key={entry.timestamp || index} entry={entry} onClick={handleEntryClick} onDelete={handleDelete} />
            ))}
          </div>
        </div>
        <div className="z-10 w-3/4 p-8 overflow-y-auto">
          {selectedEntry ? (
            <div>
              <h1 className="text-3xl font-bold mb-4 font-atop">
          <span style={{ textShadow: '0 0 4px black' }}>
                {selectedEntry.timestamp ? new Date(selectedEntry.timestamp.replace(/_/g, '-').replace(/\./g,':')).toLocaleDateString() : 'New Entry'}
                </span></h1>
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <p>{selectedEntry.entry}</p>

                {selectedEntry.analysis && (
                  <div className="mt-4 border-t border-gray-700 pt-4">
                    <h3 className="text-lg font-bold">Analysis</h3>
                    <p>{selectedEntry.analysis}</p>
                  </div>
                )}
              </div>
              <div className="ml-4">
                  <img src={`http://localhost:5000/${selectedEntry.timestamp}`} alt="Generated" style={{width: "700px", height: "700px"}}/>
                </div>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold mb-4 font-atop">
          <span style={{ textShadow: '0 0 4px black' }}>New Journal Entry</span></h1>
              <textarea
                className="w-full h-64 p-2 border rounded-lg bg-gray-800 text-white mb-10 text-2xl cursor-target"
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                placeholder="Write your journal entry here..."
              />
              <div className="flex items-center">
              <button
                className="cursor-target text-blue-400 hover:text-blue-700 font-bold rounded font-atop text-3xl"
                onClick={handleSubmit}
              >
        <GlassSurface
    width={500}
    height={50}
    borderRadius={24}
    className="flex items-center justify-center"
  >
          <span style={{ textShadow: '0 0 4px black' }}>Submit</span>
          </GlassSurface>
              </button>
              </div>
            </div>
          )}
        <Link
          to="/"
          className="cursor-target z-10 mt-8 text-gray-100 hover:text-gray-400 font-bold rounded self-center mb-4 font-atop text-3xl m-10"
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
      </div>
    </PageTransition>
  );
};

export default Journal;