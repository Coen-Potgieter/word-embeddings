const ErrorSection: React.FC = () => {
  return (
    <div className="flex bg-red-300 m-8 h-[50vh] justify-center items-center">
      <p className="font-serif">Failed To Load Embeddings, Sorry...</p>
    </div>
  );
};

export default ErrorSection;
