type HeaderProps = {
  sectionNames: {
    id: number;
    name: string;
  }[];
  selectedSection: number;
  onSectionSelect: (id: number) => void;
};
const Header: React.FC<HeaderProps> = ({
  sectionNames,
  selectedSection,
  onSectionSelect,
}) => {
  const selectedStyle = " bg-my-yellow ring-3 underline";
  const nonSelectedStyle =
    " bg-transparent hover:bg-my-yellow hover:underline hover:ring-3 cursor-pointer";

  return (
    <div className="flex h-20 mt-10 mx-80 mb-4 justify-around text-4xl">
      {sectionNames.map((elem) => {
        return (
          <button
            className={
              elem.id === selectedSection
                ? "decoration-2 w-full mx-1 rounded-2xl font-curvy font-extrabold" +
                  selectedStyle
                : "decoration-2 w-full mx-1 rounded-2xl font-curvy font-extrabold" +
                  nonSelectedStyle
            }
            key={elem.id}
            type="button"
            onClick={() => onSectionSelect(elem.id)}
          >
            {elem.name}
          </button>
        );
      })}
    </div>
  );
};

export default Header;
