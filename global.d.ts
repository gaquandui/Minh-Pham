// Moved the global declaration for window.aistudio here to ensure a single, consistent type definition across the project.
declare global {
  // Fix: Define the AIStudio interface to resolve "Subsequent property declarations must have the same type" error.
  // This assumes 'AIStudio' is an existing or expected type that `window.aistudio` should conform to.
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio; // Use the explicitly defined AIStudio interface.
  }
}
// Adding an empty export to make this file an ambient module, resolving the
// "Augmentations for the global scope can only be directly nested in external modules" error.
export {};