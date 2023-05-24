import React, { useState ,useEffect} from 'react'
import './match-summary.css'
import {assistIcon, goal,ownGoal, penaltyGoal, penaltyMiss, redCard, yellowCard} from './icons'
import axios from 'axios'

function MatchSummary({details}) {
    const [incidents1, setIncidents1] = useState([])
    const [incidents2, setIncidents2] = useState([])
    const [incidents3, setIncidents3] = useState([])
    const [incidents4, setIncidents4] = useState([])
    const [commentaryData, setCommentaryData] = useState([])
    const [events, setEvents] = useState(true);
    const [commentary,setCommentary] = useState(false)

        
    const summaryButtons = ["EVENTS", "COMMENTARY"];

    const setActiveButtonDetails = (e) => {
        const summaryButtons = document.querySelectorAll(".summary-buttons");
        summaryButtons.forEach((button) => {
          if (button.classList.contains("summary-active")) {
            button.classList.remove("summary-active");
          }
        });
        e.target.classList.add("summary-active");
    };

    const setActiveInitial = () => {
        const summaryButtons = document.querySelectorAll(".summary-buttons");
        summaryButtons.forEach((button) => {
          if (button.innerHTML === "EVENTS"){
           button.classList.add("summary-active");
          }
        });
    };

    const setAllIncidents=(incOrder,orderNum)=>{
        let inc = [];
        if(details.incidents !== undefined && incOrder !== undefined){                      
            Object.keys(incOrder).map((key) => {
              const newObj = {};
              newObj.home = incOrder[key][0].HOME[0];
              newObj.away = incOrder[key][0].AWAY[0];
              inc.push(newObj);
            });
            if(orderNum===1){
                setIncidents1(inc);
            }else if(orderNum===2){
                setIncidents2(inc)
            }else if(orderNum===3){
                setIncidents3(inc)
            }else if(orderNum===4){
                setIncidents4(inc)
            }
        }
    }

    useEffect(() => { 
        setActiveInitial();
        if(details.incidents){
            setAllIncidents(details.incidents.incs.football1,1)
            setAllIncidents(details.incidents.incs.football2,2)
            setAllIncidents(details.incidents.incs.football3,3)
            setAllIncidents(details.incidents.incs.football4,4)
        }
    }, []);

    const getCommentaries=()=>{
        axios.get(`${process.env.REACT_APP_SERVER_URL}/commentary`,{
            params: {
                matchId:details.id
            }
        }).then(res=>{
            setCommentaryData(res.data.slice(0,10))
        })
    }

    useEffect(()=>{
        if(commentary){
            getCommentaries()
    
            const interval = setInterval(() => {
                getCommentaries();
            }, 30000);
            
            // clear interval on unmount
            return () => clearInterval(interval);
        }
    },[commentary])


  return (
    <div>
       <div style={{ display: "flex" }}>
         {summaryButtons.map((button, i) => (
           <button key={i} className="summary-buttons" onClick={(e) => {
                if(e.target.innerHTML==="EVENTS"){
                    setEvents(true)
                    setCommentary(false)
                }else{
                    setCommentary(true)
                    setEvents(false)
                }
               setActiveButtonDetails(e);
             }}>{button}</button>
         ))}
       </div>
       <div style={{display: "grid",borderRadius: "5px",border: "1px solid #292c2f",marginTop: "15px",paddingBottom:"10px",paddingTop:"10px"}}>
        {events ? (
            <>      
            {incidents1?incidents1.map((inc, i) => (
                <div key={i}>
                  {i>0?(<hr />):''}    
                   <div style={{ display: "flex" }}>
                     <div style={{width:'15%',display:'flex',justifyContent:'center'}}>{inc.home?inc.home.time:inc.away.time}</div>
                     <div style={{ width: "35%" ,display:'grid',justifyContent:'right'}}>
                        {inc.home?(inc.home.type==='FootballOwnGoal'?(<><span>{inc.home.shortName} <span dangerouslySetInnerHTML={{ __html:ownGoal}} /></span><span>{inc.home.assist?inc.home.assist[0].shortName:''} {inc.home.assist?(<span dangerouslySetInnerHTML={{ __html:assistIcon}} />):''}</span></>):
                                    inc.home.type==='FootballGoal'?(<><span>{inc.home.shortName} <span dangerouslySetInnerHTML={{ __html:goal}} /></span><span>{inc.home.assist && inc.home.assist.length>0?inc.home.assist[0].shortName:''} {inc.home.assist && inc.home.assist.length>0?(<span dangerouslySetInnerHTML={{ __html:assistIcon}} />):''}</span></>):
                                    inc.home.type==='FootballYellowCard'?(<><span>{inc.home.shortName} <span dangerouslySetInnerHTML={{ __html:yellowCard}}/></span></>):
                                    inc.home.type==='FootballRedCard'?(<><span>{inc.home.shortName} <span dangerouslySetInnerHTML={{ __html:redCard}}/></span></>):
                                    inc.home.type==='FootballGoalPenMiss'?(<><span>{inc.home.shortName} <span dangerouslySetInnerHTML={{ __html:penaltyMiss}}/></span></>):
                                    inc.home.type==='FootballGoalPen'?(<><span>{inc.home.shortName} <span dangerouslySetInnerHTML={{ __html:penaltyGoal}}/></span></>)
                                    :''):''}</div>                      
                     <div style={{ width: "15%",display:'flex',justifyContent:'center',fontWeight:'bold' }}>
                        {inc.home?inc.home.score?inc.home.score.home+' - '+inc.home.score.away:'':
                        inc.away.score?inc.away.score.home+' - '+inc.away.score.away:''}
                     </div>
                     <div style={{ width: "35%" }}>
                        {inc.away?(inc.away.type==='FootballOwnGoal'?(<><span dangerouslySetInnerHTML={{ __html:ownGoal}} /> {inc.away.shortName}<br />{inc.away.assist?(<span dangerouslySetInnerHTML={{ __html:assistIcon}} />):''} {inc.away.assist?inc.away.assist[0].shortName:''}</>):
                                   inc.away.type==='FootballGoal'?(<><span dangerouslySetInnerHTML={{ __html:goal}} /> {inc.away.shortName}<br />{inc.away.assist?(<span dangerouslySetInnerHTML={{ __html:assistIcon}} />):''} {inc.away.assist?inc.away.assist[0].shortName:''}</>):
                                   inc.away.type==='FootballYellowCard'?(<><span dangerouslySetInnerHTML={{ __html:yellowCard}}/> {inc.away.shortName}</>):
                                   inc.away.type==='FootballRedCard'?(<><span dangerouslySetInnerHTML={{ __html:redCard}}/> {inc.away.shortName}</>):
                                   inc.away.type==='FootballGoalPenMiss'?(<><span dangerouslySetInnerHTML={{ __html:penaltyMiss}}/> {inc.away.shortName}</>):
                                   inc.away.type==='FootballGoalPen'?(<>{inc.away.shortName} <span dangerouslySetInnerHTML={{ __html:penaltyGoal}}/></>)
                                   :''):''}</div>         
                   </div>
                 </div>
                )):'' }   
            {details.scores.scoresByPeriod[0].home.score?(
                <div style={{display:'flex',padding:'10px 0px',marginTop:'15px',background:'#292c2f'}}>
                    <div style={{width:'15%',display:'flex',justifyContent:'center'}}>HT</div>
                    <div style={{width:'35%'}}></div>
                    <div style={{width:'15%',fontWeight:'bold',display:'flex',justifyContent:'center'}}>{details.scores.scoresByPeriod[0].home.score+' - '+details.scores.scoresByPeriod[0].away.score}</div>
                    <div style={{width:'35%'}}></div>                
                </div>
            ):''}
            {incidents2?incidents2.map((inc, i) => (
                <div key={i}>
                    {i>0?(<hr />):''}    
                   <div style={{ display: "flex" }}>
                     <div style={{width:'15%',display:'flex',justifyContent:'center'}}>{inc.home?inc.home.time:inc.away.time}</div>
                     <div style={{ width: "35%",display:'grid',justifyContent:'right' }}>
                        {inc.home?(inc.home.type==='FootballOwnGoal'?(<><span>{inc.home.shortName} <span dangerouslySetInnerHTML={{ __html:ownGoal}} /></span><span>{inc.home.assist?inc.home.assist[0].shortName:''} {inc.home.assist?(<span dangerouslySetInnerHTML={{ __html:assistIcon}} />):''}</span></>):
                                    inc.home.type==='FootballGoal'?(<><span>{inc.home.shortName} <span dangerouslySetInnerHTML={{ __html:goal}} /></span><span>{inc.home.assist?inc.home.assist[0].shortName:''} {inc.home.assist?(<span dangerouslySetInnerHTML={{ __html:assistIcon}} />):''}</span></>):
                                    inc.home.type==='FootballYellowCard'?(<><span>{inc.home.shortName} <span dangerouslySetInnerHTML={{ __html:yellowCard}}/></span></>):
                                    inc.home.type==='FootballRedCard'?(<><span>{inc.home.shortName} <span dangerouslySetInnerHTML={{ __html:redCard}}/></span></>):
                                    inc.home.type==='FootballGoalPenMiss' || 'FootballGoalMiss'?(<><span>{inc.home.shortName} <span dangerouslySetInnerHTML={{ __html:penaltyMiss}}/></span></>):
                                    inc.home.type==='FootballGoalPen'?(<><span>{inc.home.shortName} <span dangerouslySetInnerHTML={{ __html:penaltyGoal}}/></span></>)
                                    :''):''}</div>                      
                     <div style={{ width: "15%",display:'flex',justifyContent:'center',fontWeight:'bold' }}>
                        {inc.home?inc.home.score?inc.home.score.home+' - '+inc.home.score.away:'':
                        inc.away.score?inc.away.score.home+' - '+inc.away.score.away:''}
                     </div>
                     <div style={{ width: "35%" }}>
                        {inc.away?(inc.away.type==='FootballOwnGoal'?(<><span dangerouslySetInnerHTML={{ __html:ownGoal}} /> {inc.away.shortName}<br />{inc.away.assist?(<span dangerouslySetInnerHTML={{ __html:assistIcon}} />):''} {inc.away.assist?inc.away.assist[0].shortName:''}</>):
                                   inc.away.type==='FootballGoal'?(<><span dangerouslySetInnerHTML={{ __html:goal}} /> {inc.away.shortName}<br />{inc.away.assist?(<span dangerouslySetInnerHTML={{ __html:assistIcon}} />):''} {inc.away.assist?inc.away.assist[0].shortName:''}</>):
                                   inc.away.type==='FootballYellowCard'?(<><span dangerouslySetInnerHTML={{ __html:yellowCard}}/> {inc.away.shortName}</>):
                                   inc.away.type==='FootballRedCard'?(<><span dangerouslySetInnerHTML={{ __html:redCard}}/> {inc.away.shortName}</>):
                                   inc.away.type==='FootballGoalPenMiss'?(<><span dangerouslySetInnerHTML={{ __html:penaltyMiss}}/> {inc.away.shortName}</>):
                                   inc.away.type==='FootballGoalPen'?(<>{inc.away.shortName} <span dangerouslySetInnerHTML={{ __html:penaltyGoal}}/></>)
                                   :''):''}</div>         
                   </div>
                 </div>
                )):'' } 
            {details.scores.scoresByPeriod[1].home.score?(
                <div style={{display:'flex',padding:'10px 0px',marginTop:'15px',background:'#292c2f'}}>
                    <div style={{width:'15%',display:'flex',justifyContent:'center'}}>FT</div>
                    <div style={{width:'35%'}}></div>
                    <div style={{width:'15%',fontWeight:'bold',display:'flex',justifyContent:'center'}}>{details.scores.scoresByPeriod[1].home.score+' - '+details.scores.scoresByPeriod[1].away.score}</div>
                    <div style={{width:'35%'}}></div>                
                </div>
            ):''}    
            </>
        ) :commentary?(
            <>
            {commentaryData && commentaryData.map((commentary,i)=>(
                <div key={i}>          
                    {i>0?(<><hr/></>):''}             
                    <div style={{display:'flex'}}>
                        <div style={{width:'10%',textAlign:'center'}}>{commentary.Min+"'"}</div>
                        <div style={{width:'90%'}}>{commentary.Txt}</div>
                    </div>
                </div>
            ))}
            </>
        ):(
            <>Key match events will display here as they happen</>
        )}
           </div>             
    </div>
  )
}
     
export default MatchSummary
