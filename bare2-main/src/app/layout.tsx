'use client'
import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import Sidebar from "./_components/Sidebar";
import { ThemeProvider, Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import ConfigureAmplify from 'utils/configureAmplify'
import myTheme from "~/styles/authTheme";
<ConfigureAmplify />

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <head>
        <title>DTIF app</title>
        <meta name='description' content='Description' />
      </head>
      <body className="flex">
        <main className="flex-grow ml-64">
        <ThemeProvider theme={myTheme}>
          <Authenticator>
          <Sidebar /> {/* Sidebar needs to be within the Authenticator so that it does not render to unauthorised users */}
            {children}
          </Authenticator>
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
