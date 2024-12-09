// app/rshiny/page.tsx
'use client';
import React from "react";
const LensvizPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">LENSviz</h1>
        <div className="w-full h-[80vh] overflow-hidden">
          <iframe
            src="https://lens.shinyapps.io/lensviz/"
            title="LENSviz Shiny App"
            className="w-full h-full border-none"
          />
        </div>
      </div>
    </main>
  );
};

export default LensvizPage;
