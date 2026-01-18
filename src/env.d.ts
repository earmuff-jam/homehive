/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_ANALYTICS: string;
  // add other VITE_... env vars here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
