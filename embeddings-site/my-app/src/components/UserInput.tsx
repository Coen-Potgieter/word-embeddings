import { useState } from "react";
import { useEmbeddings } from "../context/embeddings";

type Props = {
  inputId: number;
  currIsValidWord: boolean[];
  onValidWord: (arg1: string, arg2: number) => void;
};

const UserInput: React.FC<Props> = ({
  inputId,
  currIsValidWord,
  onValidWord,
}) => {
  const [currValue, setCurrValue] = useState<string>("");
  const { embeddings, loading } = useEmbeddings();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    // Set Input Value For Each keystroke
    if (loading) return;
    const currInputValue: string = event.target.value;
    setCurrValue(currInputValue);
    if (!loading) {
      if (embeddings?.has(currInputValue)) {
        onValidWord(currInputValue, inputId);
      } else if (currIsValidWord) {
        onValidWord("", inputId);
      }
    }
  }

  let inputStyleState: string = "";
  if (currValue === "") {
    // ...
  } else if (currIsValidWord[inputId]) {
    inputStyleState = "ring-3 ring-green-600";
  } else if (!currIsValidWord[inputId]) {
    inputStyleState = "ring-3 ring-red-600";
  }

  return (
    <>
      <input
        className={
          "bg-my-beige rounded-xl text-black focus:outline-none text-center font-curvy placeholder:opacity-20 " +
          inputStyleState
        }
        type="text"
        required
        readOnly={loading}
        placeholder={loading ? "loading" : "ready"}
        value={currValue}
        onChange={handleChange}
      />
    </>
  );
};

export default UserInput;
