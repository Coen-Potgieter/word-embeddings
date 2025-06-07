import CosSimSection from "./components/CosSimSection.tsx";
import ErrorSection from "./components/ErrorSection.tsx";
import { useEmbeddings } from "./context/embeddings.tsx";
import Headers from "./components/Header.tsx";

function App() {
  const { error } = useEmbeddings();

  if (error) {
    return <ErrorSection />;
  }

  return (
    <>
      <Headers />
      <CosSimSection />
    </>
  );
}

export default App;
