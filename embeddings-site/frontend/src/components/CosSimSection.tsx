import UserInput from "./UserInput";
import { useState } from "react";
import { useEmbeddings } from "../context/embeddings.tsx";
import { calcCosSim } from "../helper-funcs.ts";
import { VectorGraph } from "./VectorGraph.tsx";

const CosSimSection: React.FC = () => {
  const [validWord, setValidWord] = useState<string[]>(["", ""]);
  const { embeddings } = useEmbeddings();

  const currWordIsValid: boolean[] = [
    validWord[0].length != 0,
    validWord[1].length != 0,
  ];

  function handleValidWord(newWord: string, id: number): void {
    setValidWord((prevState) => {
      const newState = [...prevState];
      newState[id] = newWord;
      return newState;
    });
  }

  let cosSimText: string;
  if (currWordIsValid[0] && currWordIsValid[1]) {
    const cosSim: number = calcCosSim(
      embeddings?.get(validWord[0]),
      embeddings?.get(validWord[1]),
    );
    cosSimText = cosSim.toPrecision(4);
  } else {
    cosSimText = "";
  }

  const vectorCols = ["#ff0000", "#0000ff"];

  return (
    <div className="flex justify-center h-screen w-screen p-0 m-0">
      <div className="h-fit w-fit px-30 flex-col pt-10 bg-my-beige-tranparent border-black ring-2 mt-0 rounded-[80px] text-4xl">
        <div className="flex justify-center font-bold font-curvy">
          <h1>Cosine Similarity Between</h1>
        </div>
        <div className="pt-5 flex flex-row justify-center text-3xl">
          <UserInput
            inputId={0}
            currIsValidWord={currWordIsValid}
            vectorCol={vectorCols[0]}
            onValidWord={handleValidWord}
          />
          <h1 className="font-curvy px-10 font-bold">&</h1>
          <UserInput
            inputId={1}
            currIsValidWord={currWordIsValid}
            vectorCol={vectorCols[1]}
            onValidWord={handleValidWord}
          />
        </div>
        <div className="flex-col text-center min-h-24 pt-4 font-curvy font-bold text-3xl">
          <h1 className="pb-2">Is</h1>
          <label>{cosSimText ? cosSimText : "..."}</label>
        </div>

        <div className="flex justify-center pb-4">
          <VectorGraph
            words={validWord}
            vectorCols={vectorCols}
            // background="#000"
            size={500}
            axisColor="#000"
            axisWidth={2}
            gridSize={0}
          />
        </div>
      </div>
    </div>
  );
};

export default CosSimSection;
