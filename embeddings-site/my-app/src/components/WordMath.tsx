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

const WordMath: React.FC = () => {
  const [validWord, setValidWord] = useState<string[]>(["", ""]);
  const [newWord, setNewWord] = useState<string>("...");
  // First `+` is never rendered. Dont ask
  const [operators, setOperators] = useState<string[]>(["+", "+"]);
  const { embeddings } = useEmbeddings();

  const currWordIsValid: boolean[] = validWord.map((word) => word.length != 0);

  function handleValidWord(newWord: string, id: number): void {
    setValidWord((prevState) => {
      const newState = [...prevState];
      newState[id] = newWord;
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

  useEffect(() => {
    if (!allWordsValid) return;

    // All words valid, now calculate new vector
    let runningResult: tf.Tensor1D = tf.zerosLike(embeddings.get("the"));
    for (let i = 0; i < validWord.length; i++) {
      runningResult = vectorOperation(
        runningResult,
        embeddings.get(validWord[i]),
        operators[i],
      );
    }

    findMostSimilar(runningResult, embeddings).then((bestWord) => {
      setNewWord(bestWord);
    });
    // setNewWord(bestWord);
  }, [...validWord]);

  return (
    <div>
      <div className="flex-col text-center">
        <div className="flex justify-center overflow-x-auto scrollbar-none text-4xl py-10">
          {validWord.map((_, id) => {
            return (
              <div key={id} className="flex items-center">
                {id != 0 && (
                  <button
                    className="mx-1 w-12 h-12 text-green-600 rounded-2xl text-center"
                    key={id + 100}
                    onClick={() => handleChangeOperator(id)}
                  >
                    {operators[id]}
                  </button>
                )}
                <UserInput
                  key={id + 200}
                  inputId={id}
                  currIsValidWord={currWordIsValid}
                  onValidWord={handleValidWord}
                />
              </div>
            );
          })}
        </div>
        <div className="flex-col text-3xl font-curvy font-bold">
          <p>= {newWord} </p>
          <p>With ... Similarity</p>
        </div>
        <div className="flex justify-around font-curvy text-4xl font-semibold py-3">
          <button
            onClick={() => handleAddRemoveWords(true)}
            className="cursor-pointer"
          >
            Add Word
          </button>
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
