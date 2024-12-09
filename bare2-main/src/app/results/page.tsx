// app/results/page.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const DownloadResults = () => {
  // Sample data for previous results (replace this with your actual data)
  const allResults = [
    { id: 1, title: 'Patient 1', description: 'Description of Patient 1' },
    { id: 2, title: 'Patient 2', description: 'Description of Patient 2' },
    { id: 3, title: 'Patient 3', description: 'Description of Patient 3' },
    { id: 4, title: 'Patient 4', description: 'Description of Patient 4' },
    { id: 5, title: 'Patient 5', description: 'Description of Patient 5' },
    { id: 6, title: 'Patient 6', description: 'Description of Patient 6' },
    { id: 7, title: 'Patient 7', description: 'Description of Patient 7' },
    { id: 8, title: 'Patient 8', description: 'Description of Patient 8' },
    { id: 9, title: 'Patient 9', description: 'Description of Patient 9' },
    { id: 10, title: 'Patient 10', description: 'Description of Patient 10' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5; // Number of results to display per page

  // Filter results based on the search term
  const filteredResults = allResults.filter(result =>
    result.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current results for the current page
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult);

  // Calculate total pages
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);

  const handleDownload = (resultId: string) => {
    console.log(`Downloading result ${resultId}...`);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white items-center justify-center">
      <div className="container max-w-3xl p-8 text-center">
        
        {/* Header Section with Gradient Background */}
        <div className="bg-gradient-to-b from-[#2e026d] to-[#15162c] p-6 rounded-lg mb-8">
          <h1 className="text-5xl font-extrabold tracking-tight">Download Results</h1>
        </div>

        <input
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 p-3 border border-white rounded bg-transparent text-white w-full placeholder:text-white"
        />
        <div className="mb-4">
          {currentResults.length > 0 ? (
            currentResults.map(result => (
              <div key={result.id} className="mb-3 p-4 bg-white/10 rounded-lg hover:bg-white/20 transition duration-300">
                <h2 className="text-2xl font-semibold">{result.title}</h2>
                <button
                  onClick={() => handleDownload(String(result.id))}
                  className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                >
                  Download
                </button>
              </div>
            ))
          ) : (
            <p>No patients found.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-600 transition duration-300 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Previous
          </button>
          <span className="text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`py-2 px-4 rounded bg-blue-500 text-white hover:bg-blue-600 transition duration-300 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadResults;
