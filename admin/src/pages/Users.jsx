import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import MiniDrawer from '../components/drawer/MiniDrawer'

function Users() {
    const location = useLocation()
    const {open} = location.state!==null?location.state:true
    
    
  return (
    <div>
      <MiniDrawer page={'Users'} open={open}/>
    </div>          
  )
}

export default Users
