const Header: React.FC = () => {
  const headerNames: string[] = ["Cosine Similarity", "Linguistic Arithmetic"];
  return (
    <div className="flex p-10 pb-0 justify-around">
      {headerNames.map((name) => {
        return (
          <button
            className="bg-my-yellow hover:bg-my-yellow"
            key={name}
            type="button"
          >
            {name}
          </button>
        );
      })}
    </div>
  );
};

export default Header;
