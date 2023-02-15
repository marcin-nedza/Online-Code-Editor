import { useState } from "react";
import {NAV_HEIGHT} from "../../constants/css";

type Props={
    handleRunCode:()=>void;
    handleSaveFile:()=>void;
}
const Navbar = ({handleRunCode,handleSaveFile}:Props) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };

    const saveFile=()=>{
        handleSaveFile()
        setOpen(false)

    }
  return (
    <div className={`flex w-full py-1 h-[var(--navbar-h)] text-sm text-white bg-secondary`}>
      <div className="flex items-center pl-2">
        <div className="relative">
          <button className="" onClick={handleClick}>
            Menu
          </button>
          {open && (
            <div className="absolute left-0 top-[26px] p-2 z-10 flex flex-col bg-dark-accent">
              <button onClick={saveFile} className="">Save</button>
              <button className="">option</button>
              <button className="">option</button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center pl-2">
        <div className="">
          <button className="" onClick={handleRunCode}>
            Run
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

// <div className="flex justify-between w-full py-1 text-sm text-white bg-secondary">
//   <div className="flex">
//
//     <div className="pl-2">
//       <div className="relative h-2">
//         <button className="" onClick={handleClick}>
//                         Menu
//         </button>
//         {open && (
//           <div className="absolute  top-[24px] z-10 flex flex-col bg-dark-accent">
//             <div className="">option</div>
//             <div className="">option</div>
//             <div className="">option</div>
//           </div>
//         )}
//       </div>
//     </div>
//     <div className="pl-2">
//       <div className="relative h-2">
//         <button className="" onClick={()=>{}}>
//                         Run
//         </button>
//       </div>
//     </div>
//   </div>
//   <div className="pr-3">run</div>
// </div>
