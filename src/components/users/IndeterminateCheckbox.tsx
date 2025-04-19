import { useEffect, useRef, HTMLProps } from "react";

type IndeterminateCheckboxProps = {
  indeterminate?: boolean;
  className?: string;
} & HTMLProps<HTMLInputElement>;

const IndeterminateCheckbox = ({
  indeterminate,
  className = "",
  ...rest
}: IndeterminateCheckboxProps) => {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={`cursor-pointer ${className}`}
      {...rest}
    />
  );
};

export default IndeterminateCheckbox;
