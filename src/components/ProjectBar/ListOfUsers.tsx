import React, {useContext} from "react";
import {ProjectPageContext} from "../../contexts/projectPageContext";
import {api} from "../../utils/api";

const ListOfUsers = () => {
    
    const {project} = useContext(ProjectPageContext);
    console.log('asd',project)
  return (
    <div className="flex min-h-[50vh] w-2/3 flex-col px-2 text-sm md:flex-row">
      <div className="basis-1/2">
        <p className="pb-1 border-b border-b-accent">Users assigned </p>
        <div className="min-h-full pt-2 md:border-r md:border-r-accent">
                    {project?.colaborations.map((user)=>(
                    <p>{user.user.username}</p>
                    ))}
        </div>
      </div>
      <div className="basis-1/2">
        <p className="pb-1 border-b border-b-accent">Sent invitations </p>
        <div className="pt-2 md:pl-4">
          <p>asdad</p>
          <p>asdad</p>
          <p>asdad</p>
        </div>
      </div>
    </div>
  );
};

export default ListOfUsers;
