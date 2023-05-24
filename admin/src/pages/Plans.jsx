import React from 'react'
import { useLocation } from 'react-router-dom'
import MiniDrawer from '../components/drawer/MiniDrawer'

function Plans() {
    const location = useLocation()
    const {open} = location.state!==null?location.state:true

  return (
    <div>
     <MiniDrawer page={'Plans'} open={open}/>
    </div>                        
  )  
}

export default Plans
