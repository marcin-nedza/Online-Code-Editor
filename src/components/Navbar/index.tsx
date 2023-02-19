import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import useOutsideAlerter from "../../hooks/useComponentVisible";
import { api } from "../../utils/api";

type Props = {
    handleRunCode: () => void;
    handleSaveFile: () => void;
    isAddUsersOpen: boolean;
    setAddUsersMenuOpen: Dispatch<SetStateAction<boolean>>;
    setSelectedOption: Dispatch<SetStateAction<'project'|'option'>>;
};
const Navbar = ({
    handleRunCode,
    handleSaveFile,
    setAddUsersMenuOpen,
    isAddUsersOpen,
    setSelectedOption
}: Props) => {
    const [openMenu, setOpenMenu] = useState(false);
    const router = useRouter();
    const ref=useRef(null)
    useOutsideAlerter(ref,setOpenMenu)
    const { mutate: logout } = api.user.logout.useMutation({
        onSuccess: async () => {
            await router.push("/login");
        },
    });
    
    const saveFile = () => {
        handleSaveFile();
        setOpenMenu(false);
    };

    return (
        <div
            className={`flex h-[var(--navbar-h)] w-full justify-between bg-secondary  text-sm text-white`}
        >
            <div className="flex items-center">
                <div ref={ref} className="relative px-2 py-1 hover:bg-accent">
                    <button   className="" onClick={() => setOpenMenu(!openMenu)}>
                        Menu
                    </button>
                    {openMenu && (
                        <div className="absolute left-0 top-[26px] z-10 flex w-fit flex-col gap-2 bg-dark-accent p-3 text-xs">
                            <button onClick={saveFile} className="">
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setOpenMenu(false);
                                    setAddUsersMenuOpen(!isAddUsersOpen);
                                    setSelectedOption('option')
                                }}
                                className="whitespace-nowrap"
                            >
                                Manage Project
                            </button>
                            <button className="whitespace-nowrap">Show users</button>
                        </div>
                    )}
                </div>
                <div className="px-2 py-1 hover:bg-accent">
                    <button className="" onClick={handleRunCode}>
                        Run
                    </button>
                </div>
            </div>
            <div className="flex items-center px-2">
                <button onClick={() => logout()} className="">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Navbar;
