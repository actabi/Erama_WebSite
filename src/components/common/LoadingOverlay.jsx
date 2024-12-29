import React from 'react';

export default function LoadingOverlay({ message = "Chargement en cours..." }) {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-75 z-40 flex items-center justify-center">
      <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
}
