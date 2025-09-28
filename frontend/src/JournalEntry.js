import React from 'react';

const JournalEntry = ({ entry, onClick, onDelete }) => {
  let date = 'New Entry';
  let time = '';

  if (entry && entry.timestamp) {
//    const normalized = entry.timestamp.replace('_', ' ').replace(/-/g, ':');

    // Make a Date object
//    const d = new Date(normalized);

    // Format
//    date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
 //   time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    const d = new Date(entry.timestamp.replace(/_/g, '-').replace(/\./g,':'));
    console.log(entry.timestamp.replace(/_/g, '-').replace(/\./g,':'))
    console.log(d);
    date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    console.log(date);
    console.log(time);
  }

  return (
    <div className="flex items-center justify-between p-2 rounded-lg">
      <div 
        className="cursor-target flex items-center cursor-pointer hover:bg-gray-700 rounded-lg p-2"
        onClick={() => onClick(entry)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-5.247-7.498h10.494M4.753 9.75h14.494M4.753 14.25h14.494M12 4.753v.001M12 19.247v.001" />
        </svg>
        <span>{time ? `${time} @ ${date}` : date}</span>
      </div>
      {entry && entry.timestamp && (
        <button 
          className="text-red-500 hover:text-red-700 cursor-target"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(entry.timestamp);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default JournalEntry;
