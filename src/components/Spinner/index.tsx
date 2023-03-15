import React from "react";
type Props = {
  size?: "sm" | "lg";
  inline?: boolean;
};
const Spinner = ({ size = "lg", inline = false }: Props) => {
  return (
    <span
      className={`loader ${
        size === "sm"
          ? "!h-[30px] !w-[30px] after:!h-[30px] after:!w-[30px]"
          : ""
      }
        ${!inline ? "!absolute":""}
`}
    ></span>
  );
};

export default Spinner;
