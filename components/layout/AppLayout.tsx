import * as React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 container mx-auto">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 lg:p-10 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
