import { File } from "@prisma/client";
import { useContext } from "react";
import { ProjectPageContext } from "../../contexts/projectPageContext";
import { api } from "../../utils/api";

type Props = {
  file: File;
};
const File = ({ file }: Props) => {

  const {  reset } =
    api.compiler.writeFileAndRun.useMutation();
  const { fileTabsArray, addFileTab, activateFileTab } =
    useContext(ProjectPageContext);
  const redirect = async() => {
    if (!fileTabsArray?.find((el) => el.id === file.id)) {
      addFileTab({ id: file.id, title: file.title });
        }

    if (fileTabsArray?.find((el) => el.id === file.id)) {
      activateFileTab(file.id);
    }
        reset()
  };
  return (
    <div className="relative w-full pl-6 cursor-pointer hover:bg-accent2">
      <div
        onClick={redirect}
        className=" before:invisible 
                            before:absolute before:left-3/4 before:-bottom-2 before:z-10 
                            before:w-max 
                            before:max-w-xs
                            before:translate-x-9
                            before:-translate-y-1/2 
                            before:rounded-lg before:bg-gray-700 before:px-3 
                            before:py-1.5 before:text-white before:content-[attr(data-tip)] 
                            after:invisible after:absolute after:left-2/4 after:bottom-1 after:z-10 after:h-0 after:w-0 
                            after:translate-x-11 after:-translate-y-1/2 after:-rotate-90 after:border-8 
                            after:border-b-gray-700 after:border-l-transparent after:border-t-transparent 
                            after:border-r-transparent hover:before:visible hover:after:visible"
        data-tip={file.title}
      >
        <div className="flex">
          <p className="w-[50px] overflow-hidden text-ellipsis whitespace-nowrap py-1 pl-2">
            {file.title}
          </p>
        </div>
      </div>
    </div>
  );
};

export default File;
