import { useState } from "react";
import { useEmbeddings } from "../context/embeddings";

type Props = {
  inputId: number;
  currIsValidWord: boolean[];
  vectorCol: string;
  onValidWord: (arg1: string, arg2: number) => void;
};

const UserInput: React.FC<Props> = ({
  inputId,
  currIsValidWord,
  vectorCol,
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
    <div
      className={
        "flex items-center pr-2 bg-my-beige rounded-xl " + inputStyleState
      }
    >
      <input
        className={
          "flex-1 bg-my-beige rounded-xl text-black focus:outline-none text-center font-curvy placeholder:opacity-20 "
        }
        type="text"
        required
        readOnly={loading}
        placeholder={loading ? "loading" : "ready"}
        value={currValue}
        onChange={handleChange}
      />
      <svg
        height="30"
        width="30"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill={vectorCol}
      >
        <g stroke-width="0" />
        <g stroke-linecap="round" stroke-linejoin="round" />
        <path d="M24 6H8c-2.8 0-5 2.2-5 5v10c0 2.8 2.2 5 5 5h16c2.8 0 5-2.2 5-5V11c0-2.8-2.2-5-5-5" />
      </svg>
    </div>
  );
};

export default UserInput;
