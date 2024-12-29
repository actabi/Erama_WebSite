import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[--background]">
      <nav className="bg-white border-b border-[--border]">
        <div className="app-container">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-[--primary]">
                FreelanceTools
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn btn-outline">
                Documentation
              </button>
              <button className="btn btn-primary">
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="app-container">
        {children}
      </main>

      <footer className="bg-white border-t border-[--border] mt-12">
        <div className="app-container py-8">
          <div className="text-center text-[--text-secondary] text-sm">
            © {new Date().getFullYear()} FreelanceTools. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
