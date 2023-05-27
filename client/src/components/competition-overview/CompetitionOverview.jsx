import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './competition-overview.css'
import { isToday, isTomorrow } from './timestamp'
import axios from '../../axios/axios'
import { Tooltip } from '@mui/material'
import { UserContext } from '../../contexts/userContext'
import {ToastContainer,toast} from 'react-toastify'


function CompetitionOverview({details}) {
    const navigate=useNavigate()
    const [overview,setOverview] = useState([])
    const [results,setResults]=useState([])  
    const [fixtures, setFixtures]=useState([]) 
    const [fullFixtures, setFullFixtures] = useState([])
    const [overvw,setOvervw]=useState(true) 
    const [matches,setMatches]=useState(false)
    const [table,setTable]=useState(false)
    const [fixtr,setFixtr]=useState(true)
    const [reslt,setReslt]=useState(false)
    const [favoriteCompetitionIds, setFavoriteCompetitionIds] = useState([])
    const [tooltipFavorite, setTooltipFavorite] = useState("");
    const {userData, setUserData} = useContext(UserContext)

    const overviewMenu=['Overview','Matches','Table']
    const matchButtons = ["FIXTURES", "RESULTS"];

    const addOrRemoveFromFavoriteCompetitions= async (competition)=>{
        try {
            const result = await axios.put(
            `/add-or-remove-from-favorite-competitions`,
            { competition:competition, userId: userData._id }
            );
            setUserData(result.data.updatedUser);
        } catch (error) {
            toast(error)
        }
    }

    const favoriteColorChange = () => {
        const ids = [];
        userData.favorites.competitions.forEach((competition) => {
            if (!favoriteCompetitionIds.includes(competition.competitionId)) {
              ids.push(competition.competitionId);
            }
        });
        setFavoriteCompetitionIds([...favoriteCompetitionIds, ...ids]);
    };

    const goToTeamOverview =(teamName,teamId)=>{
        teamName=teamName.replace(' ','-')
        const teamOverviewUrl=`${process.env.REACT_APP_TEAMOVERVIEW_URL}/${teamName}/${teamId}/overview.json?`
        try {     
            axios.get(`/team-overview`,{
                        params:{url:teamOverviewUrl}
                }).then(res=>{
                    navigate(`/team-overview/${teamName}`,{state:{teamOverview:res.data}})
                })
        } catch (error) {
            toast(error.message)
        }
    }    

    
    const matchDetails=(competition,stage,team1,team2,eventId)=>{
        team1=team1.toLowerCase().replaceAll(' ','-')
        team2=team2.toLowerCase().replaceAll(' ','-')
        const match = team1+'-vs-'+team2
        const matchUrl=`${process.env.REACT_APP_MATCH_URL}/${competition}/${stage}/${match}/${eventId}.json?`
        navigate(`/match-details`,{state:{matchUrl}})
    }    

    const setActiveButton = (e) => {
        const buttons = document.querySelectorAll(".overview-menu");
        buttons.forEach((button) => {
          if (button.classList.contains("active")) {
            button.classList.remove("active");
          }
        });
        e.target.classList.add("active");
    };

    const setActiveButtonMatches = (e) => {
        const summaryButtons = document.querySelectorAll(".match-buttons");
        summaryButtons.forEach((button) => {
          if (button.classList.contains("match-active")) {
            button.classList.remove("match-active");
          }
        });
        e.target.classList.add("match-active");
    };

    const setActiveInitial = () => {
      const buttons = document.querySelectorAll(".overview-menu");
        buttons.forEach((button) => {
        if (button.innerHTML === "Overview"){
            button.classList.add("active")
            setOvervw(true)
        } 
        if(matches){
            button.classList.remove('active')
            if(button.innerHTML==="Matches"){
                button.classList.add('active')
            }
        }
        });
    }

    const setActiveInitialMatches = () => {
          const matchButtons = document.querySelectorAll(".match-buttons");
          matchButtons.forEach((button) => {
            if (button.innerHTML === "FIXTURES"){
             button.classList.add("match-active");
            }
          }); 
    }

    useEffect(()=>{
        if(matches){
            setActiveInitialMatches()
        }
    },[matches])
  
    useEffect(()=>{
        if(userData){
            favoriteColorChange()
        }
    },[userData])
   
    useEffect(()=>{
        setOverview(details)
        const past=[];const upcoming=[];const upcomingFull=[]
        details.Events.map((match,i)=>{
            if(match.Eps==='FT'){
                past.push(match)
            }
            if((match.Eps!=='FT' && match.Eps!=='Postp.') && (isToday(match.Esd.toString()) || isTomorrow(match.Esd.toString()))){
                upcoming.push(match)
            }
            if(match.Eps!=='FT') upcomingFull.push(match)      
        })
        setFixtures(upcoming)
        setResults(past)
        setFullFixtures(upcomingFull)
    },[details])
    
    useEffect(()=>{
        setActiveInitial() 
    },[])
         
  return ( 
        <>
        <div className='competition-overview-section'>
            <div style={{ display: "flex" }}>
                <div style={{ width: "50px" }}>
                <img src={`https://static.livescore.com/i2/fh/${overview.Ccd}.jpg`}
                    style={{minHeight: "30px",minWidth: "30px",maxHeight: "40px",maxWidth: "40px",borderRadius: "2px"}} alt=""/>
                </div>
                <div style={{ display: "grid" }}>
                <p style={{ fontSize: "16px", fontWeight: "bold", marginBottom: 0 }}>
                    {overview.Snm}
                </p>
                <p>{overview.Cnm}</p>     
                </div>
                <div style={{display:'flex',alignItems:'center',marginLeft:'auto'}}>
                    <svg
                      viewBox="0 0 24 24"
                      width="25"
                      height="25"
                      style={{ fill: "black" }}
                    >
                      <Tooltip title={tooltipFavorite} arrow>
                        <polygon
                          style={{
                            fill: favoriteCompetitionIds.includes(overview.Sid)
                              ? "orangered"
                              : "transparent",
                            stroke:favoriteCompetitionIds.includes(overview.Sid)? "orangered": "white"
                          }}
                          onMouseOver={(e) => {
                              e.target.style.cursor = "pointer";
                              e.target.style.zIndex = "1";
                              e.target.style.fill === "orangered"
                                ? setTooltipFavorite("Remove from Favorites")
                                : setTooltipFavorite("Add to Favorites");
                            //   setFavoriteHovered(true);
                          }}
                          onMouseOut={(e) => {
                            setTooltipFavorite("");
                            // setFavoriteHovered(false);
                          }}
                          onClick={(e) => {
                            if (favoriteCompetitionIds.includes(overview.Sid)) {
                              const newIds = favoriteCompetitionIds;
                              const index = newIds.indexOf(overview.Sid);
                              newIds.splice(index, 1);
                              setFavoriteCompetitionIds(newIds);
                            }else{
                              setFavoriteCompetitionIds([...favoriteCompetitionIds,overview.Sid]) 
                            }
                            setTooltipFavorite("");
                            if (e.target.style.fill !== "orangered") {
                            e.target.style.fill = "orangered";
                            e.target.style.stroke = "orangered";
                            } else {
                            e.target.style.fill = "transparent";
                            e.target.style.stroke = "white";
                            }
                            const competitionObj={
                                competitionId:overview.Sid,
                                logo:overview.Ccd,
                                name:overview.CompN,
                                stage:overview.Cnm
                            }
                            addOrRemoveFromFavoriteCompetitions(competitionObj)
                          }}
                          strokeWidth="1"
                          points="12,2 15.09,9.3 23.27,9.97 17.27,15.36 18.64,23.05 12,19.13 5.36,23.05 6.73,15.36 0.73,9.97 8.91,9.3"
                        />
                      </Tooltip>
                    </svg>
                </div>
            </div>
            <div>
            {overviewMenu.map((menu, i) => (
                        <span className="overview-menu" key={i} style={{marginTop: "20px",marginRight: "20px",fontWeight: "bold"}} onClick={(e) => {
                            setActiveButton(e);
                            switch (menu) {
                                case "Overview":
                                  setOvervw(true);setMatches(false);setTable(false)
                                  break;
                                case "Matches":
                                  setMatches(true);setOvervw(false);setTable(false)
                                  break;
                                case "Table":
                                  setTable(true);setMatches(false);setOvervw(false);
                                  break;  
                                default:
                                  break;
                              }
                            }}>{menu}</span>
                        ))}
            </div>
            <hr style={{marginTop:0}} />
            {overvw?(
                <>
                {fixtures.length!==0?(<><div style={{display:'flex',justifyContent:'space-between'}}>
                    <span>FIXTURES</span>   
                    <h4 onClick={()=>{
                        setOvervw(false);setMatches(true);setTable(false);setFixtr(true)
                    }}>&gt;</h4>
                </div></>):results.length===0?(<div style={{textAlign:'center'}}>There are no matches available</div>):''}
                {fixtures.slice(0,4).map((match, j) => (
                        <div onClick={()=>{
                            matchDetails(details.Ccd,details.Scd,match.T1[0].Nm,match.T2[0].Nm,match.Eid)
                        }} key={j} className="match">
                        <div className="match-time">
                            {match.Eps === "NS" ? (
                            match.Esd.toString().substring(8, 10) +
                            ":" +
                            match.Esd.toString().substring(10, 12)
                            ) : match.Eps !== "FT" &&
                            match.Eps !== "Canc." &&
                            match.Eps !== "AP" &&
                            match.Eps !== "AET" &&
                            match.Eps !== "HT" ? (
                            <span style={{ color: "red" }}>
                                {match.Eps.slice(0, -1)}
                                <p className="blink">
                                {match.Eps.charAt(match.Eps.length - 1)}
                                </p>
                            </span>
                            ) : (
                            match.Eps
                            )}
                        </div>
                        <div style={{ display: "grid" }}>
                            <img
                            className="logo-team1"
                            src={
                                "https://lsm-static-prod.livescore.com/medium/" +
                                match.T1[0].Img
                            }
                            alt=""
                            onError={(event) =>
                                (event.target.src = require("../../assets/images/pngwing.com.png"))
                            }
                            />
                            <img
                            className="logo-team2"
                            src={
                                "https://lsm-static-prod.livescore.com/medium/" +
                                match.T2[0].Img
                            }
                            alt=""
                            onError={(event) =>
                                (event.target.src = require("../../assets/images/pngwing.com.png"))
                            }
                            />
                        </div>
                        <div style={{ display: "grid" }}>
                            <p className="name-team1">{match.T1[0].Nm}</p>
                            <p className="name-team2">{match.T2[0].Nm}</p>
                        </div>
                        <div className="score-container" style={{ display: "grid" }}>
                            <p className="score-team1">{match.Tr1}</p>
                            <p className="score-team2">{match.Tr2}</p>
                        </div>
                        <div className="fav-star">
                            <svg
                            viewBox="0 0 24 24"
                            width="25"
                            height="25"
                            style={{ fill: "black" }}
                            >
                            <polygon
                                fill="#292c2f"
                                stroke={
                                match.Eps.charAt(match.Eps.length - 1) === "'"
                                    ? "#fff"
                                    : match.Eps === "HT"
                                    ? "#fff"
                                    : "#706e6e"
                                }
                                strokeWidth="1"
                                points="12,2 15.09,9.3 23.27,9.97 17.27,15.36 18.64,23.05 12,19.13 5.36,23.05 6.73,15.36 0.73,9.97 8.91,9.3"
                            />
                            </svg>
                        </div>
                        </div>
                    ))}           
                {results.length!==0 && <div style={{display:'flex',justifyContent:'space-between'}}>
                    <span>RESULTS</span>   
                    <h4>&gt;</h4>
                </div>}
                {results.slice(-4).map((match, j) => (
                        <div onClick={()=>{
                            matchDetails(details.Ccd,details.Scd,match.T1[0].Nm,match.T2[0].Nm,match.Eid)
                        }} key={j} className="match">
                        <div className="match-time">
                            {match.Eps === "NS" ? (
                            match.Esd.toString().substring(8, 10) +
                            ":" +
                            match.Esd.toString().substring(10, 12)
                            ) : match.Eps !== "FT" &&
                            match.Eps !== "Canc." &&
                            match.Eps !== "AP" &&
                            match.Eps !== "AET" &&
                            match.Eps !== "HT" ? (
                            <span style={{ color: "red" }}>
                                {match.Eps.slice(0, -1)}
                                <p className="blink">
                                {match.Eps.charAt(match.Eps.length - 1)}
                                </p>
                            </span>
                            ) : (
                            match.Eps
                            )}
                        </div>
                        <div style={{ display: "grid" }}>
                            <img
                            className="logo-team1"
                            src={
                                "https://lsm-static-prod.livescore.com/medium/" +
                                match.T1[0].Img
                            }
                            alt=""
                            onError={(event) =>
                                (event.target.src = require("../../assets/images/pngwing.com.png"))
                            }
                            />
                            <img
                            className="logo-team2"
                            src={
                                "https://lsm-static-prod.livescore.com/medium/" +
                                match.T2[0].Img
                            }
                            alt=""
                            onError={(event) =>
                                (event.target.src = require("../../assets/images/pngwing.com.png"))
                            }
                            />
                        </div>
                        <div style={{ display: "grid" }}>
                            <p className="name-team1">{match.T1[0].Nm}</p>
                            <p className="name-team2">{match.T2[0].Nm}</p>
                        </div>
                        <div className="score-container" style={{ display: "grid" }}>
                            <p className="score-team1">{match.Tr1}</p>
                            <p className="score-team2">{match.Tr2}</p>
                        </div>
                        <div className="fav-star">
                            <svg
                            viewBox="0 0 24 24"
                            width="25"
                            height="25"
                            style={{ fill: "black" }}
                            >
                            <polygon
                                fill="#292c2f"
                                stroke={
                                match.Eps.charAt(match.Eps.length - 1) === "'"
                                    ? "#fff"
                                    : match.Eps === "HT"
                                    ? "#fff"
                                    : "#706e6e"
                                }
                                strokeWidth="1"
                                points="12,2 15.09,9.3 23.27,9.97 17.27,15.36 18.64,23.05 12,19.13 5.36,23.05 6.73,15.36 0.73,9.97 8.91,9.3"
                            />
                            </svg>
                        </div>
                        </div>
                    ))}
                {details.LeagueTable && <div style={{display:'flex',justifyContent:'space-between'}}>
                    <span>LEAGUE TABLE</span>   
                    <h4>&gt;</h4>
                </div>}      
                {details.LeagueTable && <div style={{display: "grid",borderRadius: "5px",border: "1px solid #292c2f",paddingBottom:"10px",paddingTop:"10px"}}>
                    <table>
                        <thead>
                            <tr>
                                <th style={{textAlign:'center'}}>#&nbsp;&nbsp;</th>
                                <th>TEAM</th>
                                <th style={{textAlign:'center'}}>P</th>
                                <th style={{textAlign:'center'}}>W</th>
                                <th style={{textAlign:'center'}}>D</th>
                                <th style={{textAlign:'center'}}>L</th>
                                <th style={{textAlign:'center'}}>F</th>
                                <th style={{textAlign:'center'}}>A</th>
                                <th style={{textAlign:'center'}}>GD</th>
                                <th style={{textAlign:'center'}}>PTS</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {details.LeagueTable.L[0].Tables[0].team.slice(0,5).map((team,i)=>(
                                <>
                                <tr style={{borderTop:'1px solid rgb(41, 44, 47)'}}>
                                    <td style={{textAlign:'center'}}>{team.rnk}</td>
                                    <td><img src={`https://lsm-static-prod.livescore.com/medium/${team.Img}`} alt="" height='25px' width='25px'/> {team.Tnm}</td>
                                    <td style={{textAlign:'center'}}>{team.pld}</td>
                                    <td style={{textAlign:'center'}}>{team.win}</td>
                                    <td style={{textAlign:'center'}}>{team.drw}</td>
                                    <td style={{textAlign:'center'}}>{team.lst}</td>
                                    <td style={{textAlign:'center'}}>{team.gf}</td>
                                    <td style={{textAlign:'center'}}>{team.ga}</td>
                                    <td style={{textAlign:'center'}}>{team.gd}</td>
                                    <td style={{textAlign:'center'}}>{team.pts}</td>
                                </tr>
                                </>         
                            ))}
                        </tbody>
                    </table>
                </div>}
                </>
            ):matches?(
                <>
                <div style={{ display: "flex" ,marginBottom:'15px'}}>
                 {matchButtons.map((button, i) => (
                    <button key={i} className="match-buttons" onClick={(e) => {
                       if(e.target.innerHTML==="FIXTURES"){
                           setFixtr(true)
                           setReslt(false)
                       }else{
                           setReslt(true)
                           setFixtr(false)
                       }
                      setActiveButtonMatches(e);
                    }}>{button}</button>
                  ))}
                </div>
                {fixtr?(
                    <>
                    {fullFixtures.map((match, j) => (
                        <div onClick={()=>{
                            matchDetails(details.Ccd,details.Scd,match.T1[0].Nm,match.T2[0].Nm,match.Eid)
                        }} key={j} className="match">
                        <div className="match-time">
                            {match.Eps === "NS" ? (
                            match.Esd.toString().substring(8, 10) +
                            ":" +
                            match.Esd.toString().substring(10, 12)
                            ) : match.Eps !== "FT" &&
                            match.Eps !== "Canc." &&
                            match.Eps !== "AP" &&
                            match.Eps !== "AET" &&
                            match.Eps !== "HT" ? (
                            <span style={{ color: "red" }}>
                                {match.Eps.slice(0, -1)}
                                <p className="blink">
                                {match.Eps.charAt(match.Eps.length - 1)}
                                </p>
                            </span>
                            ) : (
                            match.Eps
                            )}
                        </div>
                        <div style={{ display: "grid" }}>
                            <img
                            className="logo-team1"
                            src={
                                "https://lsm-static-prod.livescore.com/medium/" +
                                match.T1[0].Img
                            }
                            alt=""
                            onError={(event) =>
                                (event.target.src = require("../../assets/images/pngwing.com.png"))
                            }
                            />
                            <img
                            className="logo-team2"
                            src={
                                "https://lsm-static-prod.livescore.com/medium/" +
                                match.T2[0].Img
                            }
                            alt=""
                            onError={(event) =>
                                (event.target.src = require("../../assets/images/pngwing.com.png"))
                            }
                            />
                        </div>
                        <div style={{ display: "grid" }}>
                            <p className="name-team1">{match.T1[0].Nm}</p>
                            <p className="name-team2">{match.T2[0].Nm}</p>
                        </div>
                        <div className="score-container" style={{ display: "grid" }}>
                            <p className="score-team1">{match.Tr1}</p>
                            <p className="score-team2">{match.Tr2}</p>
                        </div>
                        <div className="fav-star">
                            <svg
                            viewBox="0 0 24 24"
                            width="25"
                            height="25"
                            style={{ fill: "black" }}
                            >
                            <polygon
                                fill="#292c2f"
                                stroke={
                                match.Eps.charAt(match.Eps.length - 1) === "'"
                                    ? "#fff"
                                    : match.Eps === "HT"
                                    ? "#fff"
                                    : "#706e6e"
                                }
                                strokeWidth="1"
                                points="12,2 15.09,9.3 23.27,9.97 17.27,15.36 18.64,23.05 12,19.13 5.36,23.05 6.73,15.36 0.73,9.97 8.91,9.3"
                            />
                            </svg>
                        </div>
                        </div>
                    ))}
                    </>
                ):reslt?(
                    <>
                    {results.map((match, j) => (
                        <div onClick={()=>{
                            matchDetails(details.Ccd,details.Scd,match.T1[0].Nm,match.T2[0].Nm,match.Eid)
                        }} key={j} className="match">
                        <div className="match-time">
                            {match.Eps === "NS" ? (
                            match.Esd.toString().substring(8, 10) +
                            ":" +
                            match.Esd.toString().substring(10, 12)
                            ) : match.Eps !== "FT" &&
                            match.Eps !== "Canc." &&
                            match.Eps !== "AP" &&
                            match.Eps !== "AET" &&
                            match.Eps !== "HT" ? (
                            <span style={{ color: "red" }}>
                                {match.Eps.slice(0, -1)}
                                <p className="blink">
                                {match.Eps.charAt(match.Eps.length - 1)}
                                </p>
                            </span>
                            ) : (
                            match.Eps
                            )}
                        </div>
                        <div style={{ display: "grid" }}>
                            <img
                            className="logo-team1"
                            src={
                                "https://lsm-static-prod.livescore.com/medium/" +
                                match.T1[0].Img
                            }
                            alt=""
                            onError={(event) =>
                                (event.target.src = require("../../assets/images/pngwing.com.png"))
                            }
                            />
                            <img
                            className="logo-team2"
                            src={
                                "https://lsm-static-prod.livescore.com/medium/" +
                                match.T2[0].Img
                            }
                            alt=""
                            onError={(event) =>
                                (event.target.src = require("../../assets/images/pngwing.com.png"))
                            }
                            />
                        </div>
                        <div style={{ display: "grid" }}>
                            <p className="name-team1">{match.T1[0].Nm}</p>
                            <p className="name-team2">{match.T2[0].Nm}</p>
                        </div>
                        <div className="score-container" style={{ display: "grid" }}>
                            <p className="score-team1">{match.Tr1}</p>
                            <p className="score-team2">{match.Tr2}</p>
                        </div>
                        <div className="fav-star">
                            <svg
                            viewBox="0 0 24 24"
                            width="25"
                            height="25"
                            style={{ fill: "black" }}
                            >
                            <polygon
                                fill="#292c2f"
                                stroke={
                                match.Eps.charAt(match.Eps.length - 1) === "'"
                                    ? "#fff"
                                    : match.Eps === "HT"
                                    ? "#fff"
                                    : "#706e6e"
                                }
                                strokeWidth="1"
                                points="12,2 15.09,9.3 23.27,9.97 17.27,15.36 18.64,23.05 12,19.13 5.36,23.05 6.73,15.36 0.73,9.97 8.91,9.3"
                            />
                            </svg>
                        </div>
                        </div>
                    ))}
                    </>
                ):''}
                </>
            ):table?(
                <>
                {details.LeagueTable && <div style={{display: "grid",borderRadius: "5px",border: "1px solid #292c2f",paddingBottom:"10px",paddingTop:"10px"}}>
                    <table>
                        <thead>
                            <tr>
                                <th style={{textAlign:'center'}}>#&nbsp;&nbsp;</th>
                                <th>TEAM</th>
                                <th style={{textAlign:'center'}}>P</th>
                                <th style={{textAlign:'center'}}>W</th>
                                <th style={{textAlign:'center'}}>D</th>
                                <th style={{textAlign:'center'}}>L</th>
                                <th style={{textAlign:'center'}}>F</th>
                                <th style={{textAlign:'center'}}>A</th>
                                <th style={{textAlign:'center'}}>GD</th>
                                <th style={{textAlign:'center'}}>PTS</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {details.LeagueTable.L[0].Tables[0].team.map((team,i)=>(
                                <>
                                <tr style={{borderTop:'1px solid rgb(41, 44, 47)'}}>
                                    <td style={{textAlign:'center'}}>{team.rnk}</td>
                                    <td onClick={()=>goToTeamOverview(team.Tnm,team.Tid)}><img src={`https://lsm-static-prod.livescore.com/medium/${team.Img}`} alt="" height='25px' width='25px'/> {team.Tnm}</td>
                                    <td style={{textAlign:'center'}}>{team.pld}</td>
                                    <td style={{textAlign:'center'}}>{team.win}</td>
                                    <td style={{textAlign:'center'}}>{team.drw}</td>
                                    <td style={{textAlign:'center'}}>{team.lst}</td>
                                    <td style={{textAlign:'center'}}>{team.gf}</td>
                                    <td style={{textAlign:'center'}}>{team.ga}</td>
                                    <td style={{textAlign:'center'}}>{team.gd}</td>
                                    <td style={{textAlign:'center'}}>{team.pts || team.ptsn}</td>
                                </tr>
                                </>         
                            ))}
                        </tbody>
                    </table>
                </div>}
                </>
            ):''}
        </div>
        <ToastContainer/>
        </> 
  )
}

export default CompetitionOverview
