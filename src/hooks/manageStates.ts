import {useState} from "react"

export const useManageState=()=>{
    const [isMenuOpen,setMenuOpen]=useState(false)
    const [isAddUsersOpen,setAddUsersMenuOpen]=useState(false)
    return {isAddUsersOpen,isMenuOpen,setMenuOpen,setAddUsersMenuOpen}
}
