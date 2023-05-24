import React from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar'
import './match-stats.css'

function MatchStats({statsData}) {
  return (
    <>
    <span>Match Stats</span>
    {statsData && <div style={{display: "grid",borderRadius: "5px",border: "1px solid #292c2f",marginTop: "15px",paddingBottom:"10px",paddingTop:"10px"}}>
       {statsData.shotsOnTarget && <div style={{display:'grid',padding:'10px'}}>
         <div style={{display:'flex',justifyContent:'space-between'}}>
            <span>{statsData.shotsOnTarget[0]}</span>
            <span>Shots on target</span>
            <span>{statsData.shotsOnTarget[1]}</span>
         </div>
         <div style={{display:'flex',justifyContent:'space-between'}}>
            <span style={{width:'49%'}}>
            <ProgressBar className={`progress-reversed ${statsData.shotsOnTarget[0]>statsData.shotsOnTarget[1]?'large-progress':'small-progress'}`} style={{background:'#292c2f'}} now={statsData.shotsOnTarget[0]} max={statsData.shotsOnTarget[0]+statsData.shotsOnTarget[1]}/>
            </span>
            <span style={{width:'49%'}}>
            <ProgressBar className={statsData.shotsOnTarget[1]>statsData.shotsOnTarget[0]?'large-progress':'small-progress'} style={{background:'#292c2f'}} now={statsData.shotsOnTarget[1]} max={statsData.shotsOnTarget[0]+statsData.shotsOnTarget[1]}/>
            </span>
         </div>        
       </div>}
       {statsData.shotsOffTarget && <div style={{display:'grid',padding:'10px'}}>
         <div style={{display:'flex',justifyContent:'space-between'}}>
            <span>{statsData.shotsOffTarget[0]}</span>
            <span>Shots off target</span>
            <span>{statsData.shotsOffTarget[1]}</span>
         </div>
         <div style={{display:'flex',justifyContent:'space-between'}}>
            <span style={{width:'49%'}}>
            <ProgressBar className={`progress-reversed ${statsData.shotsOffTarget[0]>statsData.shotsOffTarget[1]?'large-progress':'small-progress'}`} style={{background:'#292c2f'}} now={statsData.shotsOffTarget[0]} max={statsData.shotsOffTarget[0]+statsData.shotsOffTarget[1]}/>
            </span>
            <span style={{width:'49%'}}>
            <ProgressBar className={statsData.shotsOffTarget[1]>statsData.shotsOffTarget[0]?'large-progress':'small-progress'} style={{background:'#292c2f'}} now={statsData.shotsOffTarget[1]} max={statsData.shotsOffTarget[0]+statsData.shotsOffTarget[1]}/>
            </span>
         </div>        
       </div>}
       {statsData.shotsBlocked && <div style={{display:'grid',padding:'10px'}}>
         <div style={{display:'flex',justifyContent:'space-between'}}>
            <span>{statsData.shotsBlocked[0]}</span>
            <span>Shots blocked</span>
            <span>{statsData.shotsBlocked[1]}</span>
         </div>
         <div style={{display:'flex',justifyContent:'space-between'}}>
            <span style={{width:'49%'}}>
            <ProgressBar className={`progress-reversed ${statsData.shotsBlocked[0]>statsData.shotsBlocked[1]?'large-progress':'small-progress'}`} style={{background:'#292c2f'}} now={statsData.shotsBlocked[0]} max={statsData.shotsBlocked[0]+statsData.shotsBlocked[1]}/>
            </span>
            <span style={{width:'49%'}}>                  
            <ProgressBar className={statsData.shotsBlocked[1]>statsData.shotsBlocked[0]?'large-progress':'small-progress'} style={{background:'#292c2f'}} now={statsData.shotsBlocked[1]} max={statsData.shotsBlocked[0]+statsData.shotsBlocked[1]}/>
            </span>
         </div>        
       </div>}
       {statsData.possession && <div style={{display:'grid',padding:'10px'}}>
         <div style={{display:'flex',justifyContent:'space-between'}}>
            <span>{statsData.possession[0]}</span>
            <span>Possession(%)</span>
            <span>{statsData.possession[1]}</span>
         </div>
         <div style={{display:'flex',justifyContent:'space-between'}}>
            <span style={{width:'49%'}}>
            <ProgressBar className={`progress-reversed ${statsData.possession[0]>statsData.possession[1]?'large-progress':'small-progress'}`} style={{background:'#292c2f'}} now={statsData.possession[0]} max={100}/>
            </span>
            <span style={{width:'49%'}}>                  
            <ProgressBar className={statsData.possession[1]>statsData.possession[0]?'large-progress':'small-progress'} style={{background:'#292c2f'}} now={statsData.possession[1]} max={100}/>
            </span>
         </div>        
       </div>}
       {statsData.corners && <div style={{display:'grid',padding:'10px'}}>
         <div style={{display:'flex',justifyContent:'space-between'}}>
            <span>{statsData.corners[0]}</span>
            <span>Corner kicks</span>
            <span>{statsData.corners[1]}</span>
         </div>
         <div style={{display:'flex',justifyContent:'space-between'}}>
            <span style={{width:'49%'}}>
            <ProgressBar className={`progress-reversed ${statsData.corners[0]>statsData.corners[1]?'large-progress':'small-progress'}`} style={{background:'#292c2f'}} now={statsData.corners[0]} max={statsData.corners[0]+statsData.corners[1]}/>
            </span>
            <span style={{width:'49%'}}>                  
            <ProgressBar className={statsData.corners[1]>statsData.corners[0]?'large-progress':'small-progress'} style={{background:'#292c2f'}} now={statsData.corners[1]} max={statsData.corners[0]+statsData.corners[1]}/>
            </span>
         </div>        
       </div>}
       {statsData.offsides && <div style={{display:'grid',padding:'10px'}}>
         <div style={{display:'flex',justifyContent:'space-between'}}>
            <span>{statsData.offsides[0]}</span>
            <span>Offsides</span>
            <span>{statsData.offsides[1]}</span>
         </div>
         <div style={{display:'flex',justifyContent:'space-between'}}>
            <span style={{width:'49%'}}>
            <ProgressBar className={`progress-reversed ${statsData.offsides[0]>statsData.offsides[1]?'large-progress':'small-progress'}`} style={{background:'#292c2f'}} now={statsData.offsides[0]} max={statsData.offsides[0]+statsData.offsides[1]}/>
            </span>
            <span style={{width:'49%'}}>                  
            <ProgressBar className={statsData.offsides[1]>statsData.offsides[0]?'large-progress':'small-progress'} style={{background:'#292c2f'}} now={statsData.offsides[1]} max={statsData.offsides[0]+statsData.offsides[1]}/>
            </span>
         </div>        
       </div>}
       {statsData.fouls && <div style={{display:'grid',padding:'10px'}}>
         <div style={{display:'flex',justifyContent:'space-between'}}>
            <span>{statsData.fouls[0]}</span>
            <span>Fouls</span>
            <span>{statsData.fouls[1]}</span>
         </div>
         <div style={{display:'flex',justifyContent:'space-between'}}>
            <span style={{width:'49%'}}>
            <ProgressBar className={`progress-reversed ${statsData.fouls[0]>statsData.fouls[1]?'large-progress':'small-progress'}`} style={{background:'#292c2f'}} now={statsData.fouls[0]} max={statsData.fouls[0]+statsData.fouls[1]}/>
            </span>
            <span style={{width:'49%'}}>                  
            <ProgressBar className={statsData.offsides[1]>statsData.fouls[0]?'large-progress':'small-progress'} style={{background:'#292c2f'}} now={statsData.fouls[1]} max={statsData.fouls[0]+statsData.fouls[1]}/>
            </span>
         </div>        
       </div>}
       {statsData.throwIns && <div style={{display:'grid',padding:'10px'}}>
         <div style={{display:'flex',justifyContent:'space-between'}}>
            <span>{statsData.throwIns[0]}</span>
            <span>Throw ins</span>
            <span>{statsData.throwIns[1]}</span>       
         </div>
         <div style={{display:'flex',justifyContent:'space-between'}}>
            <span style={{width:'49%'}}>
            <ProgressBar className={`progress-reversed ${statsData.throwIns[0]>statsData.throwIns[1]?'large-progress':'small-progress'}`} style={{background:'#292c2f'}} now={statsData.throwIns[0]} max={statsData.throwIns[0]+statsData.throwIns[1]}/>
            </span>
            <span style={{width:'49%'}}>                  
            <ProgressBar className={statsData.throwIns[1]>statsData.throwIns[0]?'large-progress':'small-progress'} style={{background:'#292c2f'}} now={statsData.throwIns[1]} max={statsData.throwIns[0]+statsData.throwIns[1]}/>
            </span>
         </div>        
       </div>}
       {statsData.yellowCards && <div style={{display:'grid',padding:'10px'}}>
         <div style={{display:'flex',justifyContent:'space-between'}}>
            <span>{statsData.yellowCards[0]}</span>
            <span>Yellow cards</span>
            <span>{statsData.yellowCards[1]}</span>       
         </div>
         <div style={{display:'flex',justifyContent:'space-between'}}>
            <span style={{width:'49%'}}>
            <ProgressBar className={`progress-reversed ${statsData.yellowCards[0]>statsData.yellowCards[1]?'large-progress':'small-progress'}`} style={{background:'#292c2f'}} now={statsData.yellowCards[0]} max={statsData.yellowCards[0]+statsData.yellowCards[1]}/>
            </span>
            <span style={{width:'49%'}}>                  
            <ProgressBar className={statsData.yellowCards[1]>statsData.yellowCards[0]?'large-progress':'small-progress'} style={{background:'#292c2f'}} now={statsData.yellowCards[1]} max={statsData.yellowCards[0]+statsData.yellowCards[1]}/>
            </span>
         </div>        
       </div>}
       {statsData.redCards && <div style={{display:'grid',padding:'10px'}}>
         <div style={{display:'flex',justifyContent:'space-between'}}>
            <span>{statsData.redCards[0]}</span>
            <span>Red cards</span>
            <span>{statsData.redCards[1]}</span>       
         </div>
         <div style={{display:'flex',justifyContent:'space-between'}}>
            <span style={{width:'49%'}}>
            <ProgressBar className={`progress-reversed ${statsData.redCards[0]>statsData.redCards[1]?'large-progress':'small-progress'}`} style={{background:'#292c2f'}} now={statsData.redCards[0]} max={statsData.redCards[0]+statsData.redCards[1]}/>
            </span>
            <span style={{width:'49%'}}>                  
            <ProgressBar className={statsData.redCards[1]>statsData.redCards[0]?'large-progress':'small-progress'} style={{background:'#292c2f'}} now={statsData.redCards[1]} max={statsData.redCards[0]+statsData.redCards[1]}/>
            </span>
         </div>        
       </div>}
    </div>}
    </>
    
  )
}

export default MatchStats
