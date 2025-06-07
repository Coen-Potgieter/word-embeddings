import React, { createContext, useContext, useEffect, useState } from "react";

// Type of each embedding
type EmbeddingMap = Map<string, number[]>;

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
    console.log("Executed loading");
    fetch("data/embeddings-data.json")
      .then((res) => res.json())
      .then((obj) => {
        setEmbeddings(new Map<string, number[]>(Object.entries(obj)));
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
