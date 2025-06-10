import CosSimSection from "./components/CosSimSection.tsx";
import WordMath from "./components/WordMath.tsx";
import ExplanationSection from "./components/ExplanationSection.tsx";
import ErrorSection from "./components/ErrorSection.tsx";
import { useEmbeddings } from "./context/embeddings.tsx";
import Headers from "./components/Header.tsx";
import { useState } from "react";

const SECTION_NAMES = [
  { id: 0, name: "Cosine Similarity" },
  { id: 1, name: "Linguistic Arithmetic" },
  { id: 2, name: "Explanation" },
];

function App() {
  console.log("APP RENDERED");
  const { error } = useEmbeddings();

  const [selectedSection, setSelectedSection] = useState<number>(0);

  function handleSectionSelect(id: number): void {
    if (id === selectedSection) return;
    setSelectedSection(id);
  }

  if (error) {
    return <ErrorSection />;
  } else {
    return (
      <>
        <Headers
          sectionNames={SECTION_NAMES}
          selectedSection={selectedSection}
          onSectionSelect={handleSectionSelect}
        />
        {selectedSection === 0 && <CosSimSection />}
        {selectedSection === 1 && <WordMath />}
        {selectedSection === 2 && <ExplanationSection />}
      </>
    );
  }
}

export default App;
