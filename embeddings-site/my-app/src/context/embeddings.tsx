import React, { createContext, useContext, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";

// Type of each embedding
type EmbeddingMap = Map<string, tf.Tensor1D>;

interface EmbeddingContextType {
  embeddings: EmbeddingMap | null;
  loading: boolean;
  error: Error | null;
}

const EmbeddingContext = createContext<EmbeddingContextType>({
  embeddings: null,
  loading: true,
  error: null,
});

// Provider
export const EmbeddingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [embeddings, setEmbeddings] = useState<EmbeddingMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch("data/embeddings-data.json")
      .then((res) => res.json())
      .then((obj) => {
        // Convert JSON object to Map<string, tf.Tensor1D>
        const embeddingsMap = new Map<string, tf.Tensor1D>();

        Object.entries(obj).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            embeddingsMap.set(key, tf.tensor1d(value as number[]));
          }
        });

        setEmbeddings(embeddingsMap);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <EmbeddingContext.Provider value={{ embeddings, loading, error }}>
      {children}
    </EmbeddingContext.Provider>
  );
};

// Custom hook
export const useEmbeddings = () => useContext(EmbeddingContext);
