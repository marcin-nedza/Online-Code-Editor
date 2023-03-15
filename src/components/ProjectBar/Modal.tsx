import React, {useRef} from 'react'
import useOutsideAlerter from '../../hooks/useComponentVisible';

type Props={
    onclose:(v:boolean)=>void;
    text:string;
    onClick:()=>void;
}
const Modal = ({onclose,text,onClick}:Props) => {
  const ref = useRef(null);
  useOutsideAlerter(ref, onclose);
  return (
          <div
            ref={ref}
            className="absolute top-0 z-10 w-32 p-3 border border-accent-light right-10 bg-accent"
          >
            <p className="text-center">{text}</p>
            <div className="flex justify-around px-4 pt-2">

              <div
                onClick={() => {
                        onClick()
                  onclose(false);
                }}
                className="flex h-6 w-6 cursor-pointer items-center justify-center text-[1rem] hover:bg-red-400"
              >
                &#10003; 
              </div>
              <div
                onClick={() => onclose(false)}
                className="flex h-6 w-6 cursor-pointer items-center justify-center text-[1rem] "
              >
                &#9747; 
              </div>
            </div>
          </div>
  )
}

export default Modal
