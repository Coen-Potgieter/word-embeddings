import UserInput from "./UserInput";
import { useState, useEffect } from "react";
import { useEmbeddings } from "../context/embeddings.tsx";
import {
  calcCosSim,
  findMostSimilar,
  vectorOperation,
} from "../helper-funcs.ts";
import { VectorGraph } from "./VectorGraph.tsx";
import * as tf from "@tensorflow/tfjs";
import { pass } from "three/tsl";

const WordMath: React.FC = () => {
  const [validWord, setValidWord] = useState<string[]>(["", ""]);
  const [newWord, setNewWord] = useState<string[]>(["...", "..."]);
  // First `+` is never rendered. Dont ask
  const [myOperators, setOperators] = useState<string[]>(["+", "+"]);
  const { embeddings } = useEmbeddings();

  const currWordIsValid: boolean[] = validWord.map((word) => word.length != 0);

  function handleValidWord(updatedWord: string, id: number): void {
    setValidWord((prevState) => {
      const newState = [...prevState];
      newState[id] = updatedWord;
      return newState;
    });
  }

  function handleChangeOperator(id: number) {
    setOperators((prevState) => {
      const newState = [...prevState];
      newState[id] = newState[id] === "+" ? "-" : "+";
      return newState;
    });
  }

  function handleAddRemoveWords(adding: boolean) {
    if (adding) {
      setValidWord((prevState) => {
        const newState = [...prevState];
        newState.push("");
        return newState;
      });
      setOperators((prevOpps) => {
        const newOpps = [...prevOpps];
        newOpps.push("+");
        return newOpps;
      });
    } else {
      setValidWord((prevState) => {
        const newState = [...prevState];
        newState[newState.length - 1] = "";
        return newState;
      });
      setValidWord((prevState) => {
        const newState = [...prevState];
        newState.pop();
        return newState;
      });
      setOperators((prevOpps) => {
        const newOpps = [...prevOpps];
        newOpps.pop();
        return newOpps;
      });
    }
  }

  const removeBtnIsDisabled = validWord.length <= 2;
  let btnAddedStyle = " cursor-pointer";
  if (removeBtnIsDisabled) {
    btnAddedStyle += "cursor-default";
  }

  const allWordsValid = currWordIsValid.every((value) => value === true);

  function handleCalc() {
    if (!allWordsValid) return;

    // All words valid, now calculate new vector
    let runningResult: tf.Tensor1D = tf.zerosLike(embeddings.get("the"));
    for (let i = 0; i < validWord.length; i++) {
      runningResult = vectorOperation(
        runningResult,
        embeddings.get(validWord[i]),
        myOperators[i],
      );
    }

    findMostSimilar(runningResult, embeddings, validWord).then(
      ([bestWord, bestSim]) => {
        setNewWord([bestWord, bestSim.toPrecision(4)]);
      },
    );
  }

  let operatorStyle: string[] = [];
  for (let i = 0; i < myOperators.length; i++) {
    if (myOperators[i] === "+") operatorStyle.push(" text-green-600");
    if (myOperators[i] === "-") operatorStyle.push(" text-red-600");
  }

  const vectorCols = ["#ff0000", "#0000ff", "#FFBB64", "#38E54D", "#9C19E0"];
  let passedCols = [...vectorCols];
  let passedWords = validWord.map((word) => word);

  console.log("NEW WORD", newWord[0]);
  if (!(newWord[0] === "...")) {
    passedWords = [newWord[0], ...passedWords];
    passedCols = ["#FAEF5D", ...vectorCols];
  }
  return (
    <div>
      <div className="flex-col text-center items-center">
        <div className="flex justify-center">
          <div className="w-full flex overflow-x-auto scrollbar-none text-4xl py-10 px-[20vw]">
            {validWord.map((_, id) => {
              return (
                <div key={id} className="flex items-center">
                  {id != 0 && (
                    <button
                      className={
                        "mx-1 w-12 h-12 rounded-2xl text-center" +
                        operatorStyle[id]
                      }
                      key={id + 100}
                      onClick={() => handleChangeOperator(id)}
                    >
                      {myOperators[id]}
                    </button>
                  )}
                  <UserInput
                    key={id + 200}
                    inputId={id}
                    currIsValidWord={currWordIsValid}
                    vectorCol={vectorCols[id]}
                    onValidWord={handleValidWord}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex-col text-4xl font-curvy font-bold">
          <p>Is</p>
          <p className="capitalize py-2">{newWord[0]} </p>
          <p className="pb-2">With Similarity</p>
          <p>{newWord[1]}</p>
        </div>
        <div className="flex justify-center pb-4">
          <VectorGraph
            words={passedWords}
            vectorCols={passedCols}
            // background="#000"
            size={500}
            axisColor="#000"
            axisWidth={2}
            gridSize={0}
          />
        </div>
        <div className="flex justify-around font-curvy text-4xl font-semibold py-3">
          <button
            onClick={() => handleAddRemoveWords(true)}
            className="cursor-pointer"
          >
            Add Word
          </button>
          <button onClick={handleCalc}>Calculate</button>
          <button
            onClick={() => handleAddRemoveWords(false)}
            className={"" + btnAddedStyle}
            disabled={removeBtnIsDisabled}
          >
            Remove Word
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordMath;
