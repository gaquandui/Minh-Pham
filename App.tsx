
import React from 'react';
import { ImageGenerator } from './components/ImageGenerator';
// ApiKeySelector and LoadingSpinner are no longer needed for API key selection
// import { ApiKeySelector } from './components/ApiKeySelector'; 
// import { LoadingSpinner } from './components/LoadingSpinner';

// Removed duplicate global declaration for window.aistudio.
// It is now declared in global.d.ts to avoid "Subsequent property declarations" error.

const App: React.FC = () => {
  // All API key related state and effects are removed as we are switching to a model
  // that does not require explicit paid API key selection via window.aistudio.
  // The ImageGenerator will now be rendered directly.

  return (
    <div className="font-sans text-gray-800">
      <ImageGenerator />
    </div>
  );
};

export default App;
