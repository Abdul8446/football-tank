import React from 'react'
import MiniDrawer from '../components/drawer/MiniDrawer'
import { useLocation } from 'react-router-dom'

function ContentManagement() {
    const location= useLocation()
    const {open} = location.state!==null?location.state:true
  

  return (
    <div>
     <MiniDrawer page={'Manage Contents'} open={open}/>
    </div>
  )
}
            
export default ContentManagement
