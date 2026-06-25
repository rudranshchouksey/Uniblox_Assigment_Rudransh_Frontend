import * as React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background/50 relative">
      {/* Background noise texture or very subtle radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background -z-10 pointer-events-none" />
      <Navbar />
      <div className="flex flex-1 w-full max-w-[1600px] mx-auto relative">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 lg:p-12 w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
