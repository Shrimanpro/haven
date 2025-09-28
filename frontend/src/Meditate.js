import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Meditate = () => {
  const [meditation, setMeditation] = useState('');

  useEffect(() => {
    const fetchMeditation = async () => {
      const response = await fetch('http://localhost:5000/api/meditate');
      const data = await response.json();
      setMeditation(data.response);
    };
    fetchMeditation();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
        <p className="text-lg">{meditation}</p>
      </div>
      <Link to="/" className="mt-8 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
        Back to Menu
      </Link>
    </div>
  );
};

export default Meditate;
