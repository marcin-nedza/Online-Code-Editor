import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
type SimpleFile = {
  id: string;
  title: string;
  active?: boolean;
};
type TProjectPageContext = {
  isAddUserOpen: boolean;
  setAddUserMenuOpen: Dispatch<SetStateAction<boolean>>;
  selectedOption: "project" | "option";
  setSelectedOption: Dispatch<SetStateAction<"project" | "option">>;
  position: number;
  setPosition: Dispatch<SetStateAction<number>>;
  setFileTabsArray: Dispatch<SetStateAction<SimpleFile[]>>;
  fileTabsArray: SimpleFile[];
  addFileTab: (file: SimpleFile) => void;
  closeTab: (id: string) => void;
  activateFileTab: (id: string | undefined) => void;
  tabId: string;
  changeTabIndex: (
    arr: SimpleFile[],
    fromIndex: number,
    toIndex: number
  ) => SimpleFile[];
};
export const ProjectPageContext = createContext<TProjectPageContext>({
  isAddUserOpen: false,
  setAddUserMenuOpen: () => {},
  selectedOption: "project",
  setSelectedOption: () => {},
  position: 0,
  setPosition: () => {},
  fileTabsArray: [],
  addFileTab: () => {},
  setFileTabsArray: () => [],
  closeTab: () => {},
  activateFileTab: () => {},
  tabId: "",
  changeTabIndex: () => [],
});
type ProjectProps = {
  children: ReactNode;
};
const ProjectPageProvider = ({ children }: ProjectProps) => {
  const [position, setPosition] = useState(0);
  const [isAddUserOpen, setAddUserMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"project" | "option">(
    "project"
  );
  const [fileTabsArray, setFileTabsArray] = useState<SimpleFile[]>([]);
  const [tabId, setTabId] = useState("");
  const addFileTab = (file: SimpleFile) => {
    setTabId(file.id);
    setFileTabsArray((prevFileTabs) => {
        prevFileTabs.map(el=>{
                if(el.id==='manage'){
                    setAddUserMenuOpen(false)
                }
            }) 
      const updatedFileTabs = prevFileTabs.map((prevFileTab) => ({
        ...prevFileTab,
        active: false,
      }));
      updatedFileTabs.push({
        ...file,
        active: true,
      });
      return updatedFileTabs;
    });
  };

  const activateFileTab = (id: string | undefined) => {
    setFileTabsArray((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === id ? { ...tab, active: true } : { ...tab, active: false }
      )
    );
    //if tab is an option tab
    if (isAddUserOpen) {
      setAddUserMenuOpen(false);
    }
    if (id === "manage") {
      setAddUserMenuOpen(true);
    }
    setTabId(id);
  };
  const closeTab = (id: string) => {
    setFileTabsArray((prevTab) => prevTab.filter((el) => el.id !== id));
  };
  function changeTabIndex(
    arr: SimpleFile[],
    fromIndex: number,
    toIndex: number
  ) {
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
    return arr;
  }
  return (
    <ProjectPageContext.Provider
      value={{
        activateFileTab,
        closeTab,
        changeTabIndex,
        fileTabsArray,
        addFileTab,
        isAddUserOpen,
        setFileTabsArray,
        position,
        setPosition,
        tabId,
        selectedOption,
        setAddUserMenuOpen,
        setSelectedOption,
      }}
    >
      {children}
    </ProjectPageContext.Provider>
  );
};
export default ProjectPageProvider;
