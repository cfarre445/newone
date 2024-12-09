'use client'
import Link from "next/link";
import { useAuthenticator } from "@aws-amplify/ui-react"

export default function Home() {
    
  const { signOut } = useAuthenticator();
  return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          
          {/* Header Section with Gradient Background */}
          <div className="bg-gradient-to-b from-[#2e026d] to-[#15162c] px-28 py-6 rounded-lg mb-8 text-center"> {/* Increased horizontal padding */}
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
              DTIF <span className="text-[hsl(280,100%,70%)]">App</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="./upload"
            >
              <h3 className="text-2xl font-bold">Upload data</h3>
              <div className="text-lg">
                Upload your new raw data and corresponding LENS csv file here
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="./results"
            >
              <h3 className="text-2xl font-bold">Download results</h3>
              <div className="text-lg">
                Download the raw output from previous LENS runs
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="./java_viz"
            >
              <h3 className="text-2xl font-bold">Java Vis</h3>
              <div className="text-lg">
                View results
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="./rshiny"
            >
              <h3 className="text-2xl font-bold">LENSviz</h3>
              <div className="text-lg">
                View your results using the LENSviz shiny app
              </div>
            </Link>
          </div>
        </div>
        <button onClick={signOut}>Sign out</button>
      </main>
  );
}