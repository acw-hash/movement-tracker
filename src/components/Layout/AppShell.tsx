import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Navigation } from './Navigation';

export function AppShell() {
  return (
    <div className="min-h-screen bg-dark-950">
      <Header />
      <div className="flex">
        <Navigation />
        <main className="flex-1 min-h-screen bg-dark-950/50">
          <div className="relative">
            {/* Subtle mesh background overlay */}
            <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none"></div>
            <div className="relative z-10">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
