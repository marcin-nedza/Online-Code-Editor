import { useRouter } from "next/router";
import { useState } from "react";
import { NAV_HEIGHT } from "../../constants/css";
import { api } from "../../utils/api";

type Props = {
  handleRunCode: () => void;
  handleSaveFile: () => void;
};
const Navbar = ({ handleRunCode, handleSaveFile }: Props) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { mutate: logout } = api.user.logout.useMutation({
    onSuccess: async () => {
      await router.push("/login");
    },
  });
  const handleClick = () => {
    setOpen(!open);
  };

  const saveFile = () => {
    handleSaveFile();
    setOpen(false);
  };
  return (
    <div
      className={`flex h-[var(--navbar-h)] w-full justify-between bg-secondary px-2 py-1 text-sm text-white`}
    >
      <div className="flex items-center gap-2">
        <div className="relative">
          <button className="" onClick={handleClick}>
            Menu
          </button>
          {open && (
            <div className="absolute left-0 top-[26px] z-10 flex flex-col bg-dark-accent p-2">
              <button onClick={saveFile} className="">
                Save
              </button>
              <button className="">option</button>
              <button className="">option</button>
            </div>
          )}
        </div>
        <div className="">
          <button className="" onClick={handleRunCode}>
            Run
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <button onClick={()=>logout()} className="">Logout</button>
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
