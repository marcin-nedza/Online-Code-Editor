import React from 'react'

type Props={
    title:string
    handleClick:()=>void
}
const SingleProject:React.FC<Props> = ({ title ,handleClick}) =>{
  return (
    <div onClick={handleClick} className='flex w-full p-2 bg-teal-200 hover:cursor-pointer hover:bg-green-300'>Title: {title}</div>
  )
}

export default SingleProject
