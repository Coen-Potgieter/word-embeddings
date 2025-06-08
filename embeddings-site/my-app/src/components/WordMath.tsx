import UserInput from "./UserInput";
const WordMath: React.FC = () => {
  return (
    <div className="flex w-screen h-screen items-center justify-center">
      <UserInput />
      <h1 className="text-9xl shadow shadow-black text-red-500">TODO</h1>
    </div>
  );
};

export default WordMath;
