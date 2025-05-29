interface CurrencyWrapperProps {
  children: React.ReactNode;
  currencyPattern: string;
}

const CurrencyWrapper = ({
  children,
  currencyPattern,
}: CurrencyWrapperProps) => {
  const [pattern1, pattern2] = currencyPattern.split("x");

  return (
    <>
      {pattern1 && <span>{pattern1}</span>}
      {children}
      {pattern2 && <span>{pattern2}</span>}
    </>
  );
};

export default CurrencyWrapper;
