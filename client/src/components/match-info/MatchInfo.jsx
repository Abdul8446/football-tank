import React, { useState } from 'react'
import { formatDate } from '../match-details/convertToIST'

function MatchInfo({infoData}) {
  const [infoDetails,setInfoDetails] = useState(infoData)
  return (
    <>
    {infoDetails?(
        <>
        <span>Match Info</span>
        <div style={{display: "grid",borderRadius: "5px",border: "1px solid #292c2f",marginTop: "15px",paddingBottom:"10px",paddingTop:"10px"}}>
        <div style={{display:'flex',justifyContent:'space-around'}}>            
            <span><img src="https://www.livescore.com/ls-web-assets/svgs/common/calendar-62a86ad26c51fe49ea1c6abb202a15b4.svg" alt="" height='18px' width='18px'/> {infoDetails?.startDateTimeString && formatDate(infoDetails.startDateTimeString)}</span>
        {infoDetails.venue && <span><img src="https://www.livescore.com/ls-web-assets/svgs/common/venue-bb6d741e46d7436e13f2cf6ce72436b8.svg" alt="" /> {infoDetails.venue}</span>}
        </div>
        <div style={{display:'flex',justifyContent:'space-around',marginTop:'15px'}}> 
        {infoDetails.referees && <span><img src="https://www.livescore.com/ls-web-assets/svgs/common/referee-d0e056d51a19081940f87521c60a495b.svg" alt="" /> {infoDetails.referees[0].name+'('+infoDetails.referees[0].country+')'}</span>}
        {infoDetails.spectators && <span><img src="https://www.livescore.com/ls-web-assets/svgs/common/spectators-f3efe5b4e1ab89d3942768b2690ca938.svg" alt="" /> {infoDetails.spectators}</span>}
        </div>
        </div>
        </>      
    ):<div style={{border:'1px solid #292c2f',borderRadius:'5px',display:'flex',justifyContent:'center',padding:'10px'}}>No data available</div>}
    </>
  )    
}

export default MatchInfo
