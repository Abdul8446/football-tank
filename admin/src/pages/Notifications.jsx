import React from 'react'
import MiniDrawer from '../components/drawer/MiniDrawer'
import { useLocation } from 'react-router-dom'

function Notifications() {
    const location= useLocation()
    const {open} = location.state!==null?location.state:true

  return (
    <div>
     <MiniDrawer page={'Notifications'} open={open}/>
    </div>
  )
}     

export default Notifications
