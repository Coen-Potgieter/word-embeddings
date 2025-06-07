import UserInput from "./UserInput";
import { useState } from "react";
import { useEmbeddings } from "../context/embeddings.tsx";
import { calcCosSim } from "../helper-funcs.ts";
import { VectorGraph } from "./VectorGraph.tsx";
import * as tf from "@tensorflow/tfjs";

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

  return (
    <div className="h-fit flex-col pt-10 bg-my-beige-tranparent border-black ring-2 m-10 rounded-full">
      <div className="flex justify-center text-2xl font-bold font-idk">
        <h1>Cosine Similarity Between</h1>
      </div>
      <div className="pt-5 flex flex-row justify-center text-2xl">
        <UserInput
          inputId={0}
          currIsValidWord={currWordIsValid}
          onValidWord={handleValidWord}
        />
        <h1 className="font-idk px-10 font-bold">&</h1>
        <UserInput
          inputId={1}
          currIsValidWord={currWordIsValid}
          onValidWord={handleValidWord}
        />
      </div>
      <div className="flex-col text-center min-h-16 pt-2 font-idk font-bold">
        <h1>{cosSimText ? "Is" : ""}</h1>
        <label>{cosSimText ? cosSimText : ""}</label>
      </div>

      <div className="flex justify-center pb-10">
        <VectorGraph
          words={validWord}
          size={400}
          background="#00ff0000"
          axisColor="white"
          axisWidth={2}
        />
      </div>
    </div>
  );
};

export default CosSimSection;
