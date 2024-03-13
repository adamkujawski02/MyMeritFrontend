const UserSection = ({
  children,
  className,
}: {
  children?: JSX.Element | JSX.Element[];
  className?: string | string[];
}) => {
  return (
    <div
      className={`bg-main-darker rounded-xl select-none relative ${
        className ? className : ""
      }`}
    >
      {children}
    </div>
  );
};

export default UserSection;
