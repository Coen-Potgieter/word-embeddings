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
  const selectedStyle = " bg-my-yellow ring-3 underline  text-xl";
  const nonSelectedStyle =
    " bg-transparent hover:bg-my-yellow hover:underline hover:ring-3 cursor-pointer";

  return (
    <div className="flex h-15 mt-10 mx-40 mb-2 justify-around">
      {sectionNames.map((elem) => {
        return (
          <button
            className={
              elem.id === selectedSection
                ? "decoration-2 w-full mx-1 rounded-2xl font-curvy font-extrabold text-xl" +
                  selectedStyle
                : "decoration-2 w-full mx-1 rounded-2xl font-curvy font-extrabold text-xl" +
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
