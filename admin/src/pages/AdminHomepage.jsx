import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import MiniDrawer from '../components/drawer/MiniDrawer'
import { useSelector } from 'react-redux'
import axios from '../axios/axios'

function AdminHomepage() {
  const location= useLocation()
  const navigate = useNavigate()
  const {open} = location.state!==null?location.state:true
  const accessToken = useSelector(state=> state.access_token.value)

  useEffect(()=>{
    axios.get('/').then(res=>{
      if(res.data){
        if(res.data.error){
          navigate('/admin/login')
        }else{
        }
      }
    })
  },[])                
                     
  return (
    <div>
     <MiniDrawer page={'Dashboard'} open={open}/>            
    </div>                
  )
}
        
export default AdminHomepage
