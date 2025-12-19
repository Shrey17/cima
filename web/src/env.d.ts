/// <reference types="vite/client" />

declare module 'pdfjs-dist/build/pdf.mjs' {
  export const GlobalWorkerOptions: { workerSrc: string }
  export function getDocument(src: any): any
}

declare module 'pdfjs-dist/legacy/build/pdf.worker.entry'
