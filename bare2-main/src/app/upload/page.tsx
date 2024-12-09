// app/upload/page.tsx
'use client';
import React from 'react';
import FileUploaderCSV from '../_components/CsvUploader'; 
import FileUploaderFastq from '../_components/FastqUploader'; 

const UploadPage = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white items-center justify-center">
      <div className="container max-w-6xl p-8 text-center"> {/* Increased max-width for side-by-side layout */}     
        {/* Header Section with Gradient Background */}
        <div className="bg-gradient-to-b from-[#2e026d] to-[#15162c] p-6 rounded-lg mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">LENS File Uploads</h1>
        </div>       
        {/* Flex container for side-by-side layout */}
        <div className="flex justify-center gap-8"> {/* Added gap for spacing */}         
          {/* CSV File Uploader Section */}
          <div className="p-6 bg-white/10 rounded-lg shadow-md flex-1"> 
            <h2 className="text-2xl font-bold mb-4">Upload TSV Files</h2>
            <div className="flex justify-center items-center">
              <FileUploaderCSV />
            </div>
          </div>
          {/* FASTQ File Uploader Section */}
          <div className="p-6 bg-white/10 rounded-lg shadow-md flex-1"> 
            <h2 className="text-2xl font-bold mb-4">Upload FASTQ Files</h2>
            <div className="flex justify-center items-center">
              <FileUploaderFastq />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;