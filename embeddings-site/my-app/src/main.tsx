import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { EmbeddingProvider } from "./context/embeddings.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EmbeddingProvider>
      <App />
    </EmbeddingProvider>
  </StrictMode>,
);
