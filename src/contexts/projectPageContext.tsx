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
  active: boolean;
};
type TProjectPageContext = {
  isAddUserOpen: boolean;
  setAddUserMenuOpen: Dispatch<SetStateAction<boolean>>;
  selectedOption: "project" | "option";
  setSelectedOption: Dispatch<SetStateAction<"project" | "option">>;
  position: number;
  setPosition: Dispatch<SetStateAction<number>>;
  fileTabsArray: SimpleFile[];
  addFileTab: (file: SimpleFile) => void;
  closeTab: (id: string) => void;
  activateFileTab: (id: string) => void;
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

  const activateFileTab = (id: string) => {
    setFileTabsArray((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === id ? { ...tab, active: true } : { ...tab, active: false }
      )
    );
    console.log("CONTEXT", id);
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
    console.log("ele", element);
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
