import {useRouter} from 'next/router';
import React, {useState} from 'react'
import {api} from '../../utils/api'

const AssingUsers = () => {
    const router = useRouter()
    const projectId = router.query?.projectId as string
    const [email, setEmail] = useState('')
    const {data,mutate}=api.project.assignUserToProject.useMutation()
    const handleSubmit =(e)=>{
        e.preventDefault();

        try {
           mutate({email:email,projectId:projectId}) 
        } catch (error) {
           console.log(error) 
        }
    }
  return (
    <div>
        <p className='mb-2'>Enter users email</p>
            <form onSubmit={handleSubmit}>

            <input onChange={(e)=>setEmail(e.target.value)} placeholder='email' className='px-2 outline-none bg-accent2 caret-white' />
            </form>
        </div>
  )
}

export default AssingUsers
