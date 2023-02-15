import React from "react";
import { TERMINAL_HEIGHT } from "../../constants/css";

type Props = {
  output: string;
};
const Terminal = ({ output }: Props) => {
  return (
    <div className=" border-t-[1px] border-accent  bg-main-bg">
      <p
        className={`w-[calc(100vw_-_var(--sidebar-w))] overflow-y-scroll whitespace-pre-wrap pl-2 text-sm text-white h-[var(--terminal-h)] scrollbar-hide bg-main-bg`}
      >
        {output.length > 0 ? output : ""}
      </p>
    </div>
  );
};

export default Terminal;
