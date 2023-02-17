import React, {useState} from "react";
import { TERMINAL_HEIGHT } from "../../constants/css";

type Props = {
  output: string;
isBarOpen:boolean;
};
const Terminal = ({ output,isBarOpen }: Props) => {
    const [selectedOption, setSelectedOption] = useState('output')

    const handleOptionClick=(option)=>{
        setSelectedOption(option)
    }
  return (
    <div className=" border-t-[1px] border-accent  
  bg-main-bg">
            <div className="h-[var(--terminal-title-h)] flex text-gray-400">
                <div className="flex">

                <p onClick={()=>handleOptionClick('output')} className={`pl-2 text-sm  ${selectedOption==='output'?'underline text-white':''} cursor-pointer hover:text-white underline-offset-4`}>Output</p>
                <p onClick={()=>handleOptionClick('notes')}className={`pl-2 text-sm ${selectedOption==='notes'?'underline text-white':''} cursor-pointer hover:text-white underline-offset-4`}>Notes</p>
                </div>
                    <div className="">

                </div>
            </div>
      <p
        className={`
             scrollbar-hide 
             h-[calc(var(--terminal-h)_-_var(--terminal-title-h))] 
             w-[calc(100vw_-_var(--sidebar-w)${isBarOpen?'_-_var(--utilitybar-w)':''})] overflow-y-scroll 
             whitespace-pre-wrap bg-main-bg 
             pl-4 text-xs text-white`}
      >
        {output.length > 0 ? output : ""}
      </p>
    </div>
  );
};

export default Terminal;
