import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import React, { useState } from 'react'
import { convertToDate, convertToIST } from '../match-details/convertToIST';

function H2h({h2hData}) {
  const [h2hValue, setH2hValue] = useState('h2h')  

  const handleH2hChange = (event, newValue) => {
    setH2hValue(newValue);
  };
  
  return (
    <TabContext value={h2hValue}>
        <Box>
        <TabList className='team-overview-matches-tab' onChange={handleH2hChange} aria-label="lab API tabs example"  TabIndicatorProps={{ style: { display: 'none' } }}>
            <Tab label="H2H" value="h2h" />
            <Tab label="Home" value="home" />
            <Tab label="Away" value="away" />
        </TabList>   
        </Box>
        <TabPanel value="h2h" sx={{padding:0}}> 
            {h2hData?.h2h?.length?h2hData.h2h.map((competition, i) => (
                <div key={i}>
                    <div style={{ display: "flex" }}>
                    <div style={{ margin: "12px 5px" }}>
                        <img
                        className="competition-logo"
                        src={"https://static.livescore.com/i2/fh/" +competition.stage.flagUrl +".jpg"}
                        alt=''   
                        onError={(e)=>{e.target.src=require('../../assets/images/flagAlt.webp')}}        
                        />
                    </div>
                    <div>
                        <p
                        style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            marginBottom: 0,
                        }}
                        >
                        {competition.stage.stageName}
                        </p>
                        <p style={{ fontSize: 16 }}>{competition.stage.countryName}</p>
                    </div>
                    </div>
                    {competition.events.map((match, j) => (
                    <div onClick={()=>{
                        // matchDetails(competition.Ccd,competition.Scd,match.T1[0].Nm,match.T2[0].Nm,match.Eid)
                    }} key={j} className="match">
                        <div className="match-time" style={{display:'grid',width:'70px'}}>
                        <div style={{whiteSpace:'nowrap'}}>{convertToDate(match.startDateTimeString.toString())}</div>
                        {match.statusCode === "NS" ? (<>
                            <div>{convertToIST(match.startDateTimeString.toString())}</div>   
                        </>) : match.statusCode !== "FT" &&
                            match.statusCode !== "Canc." &&
                            match.statusCode !== "AP" &&
                            match.statusCode !== "AET" &&
                            match.statusCode !== "HT" ? (
                            <span style={{ color: "red" }}>
                            {match.statusCode.slice(0, -1)}
                            <p className="blink">
                                {match.statusCode.charAt(match.statusCode.length - 1)}
                            </p>
                            </span>
                        ) : (
                            match.StatusCode
                        )}
                        </div>
                        <div style={{ display: "grid" }}>
                        <img
                            className="logo-team1"
                            src={
                            "https://lsm-static-prod.livescore.com/medium/" +
                            match.homeSlug
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
                            match.awaySlug
                            }
                            alt=""
                            onError={(event) =>
                            (event.target.src = require("../../assets/images/pngwing.com.png"))
                            }
                        />
                        </div>
                        <div style={{ display: "grid" }}>
                        <p className="name-team1">{match.homeName}</p>
                        <p className="name-team2">{match.awayName}</p>
                        </div>
                        <div className="score-container" style={{ display: "grid" }}>
                        <p className="score-team1">{match.homeScore}</p>
                        <p className="score-team2">{match.awayScore}</p>
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
                                match.statusCode.charAt(match.statusCode.length - 1) === "'"
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
                </div>
            )):<div style={{border:'1px solid #292c2f',borderRadius:'5px',display:'flex',justifyContent:'center',padding:'10px'}}>No data available</div>}  
        </TabPanel>
        <TabPanel value="home" sx={{padding:0}}>
            {h2hData?.home?.length?h2hData.home.map((competition, i) => (
                <div key={i}>
                    <div style={{ display: "flex" }}>
                    <div style={{ margin: "12px 5px" }}>
                        <img
                        className="competition-logo"
                        src={"https://static.livescore.com/i2/fh/" +competition.stage.flagUrl +".jpg"}
                        alt=''   
                        onError={(e)=>{e.target.src=require('../../assets/images/flagAlt.webp')}}        
                        />
                    </div>
                    <div>
                        <p
                        style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            marginBottom: 0,
                        }}
                        >
                        {competition.stage.stageName}
                        </p>
                        <p style={{ fontSize: 16 }}>{competition.stage.countryName}</p>
                    </div>
                    </div>
                    {competition.events.map((match, j) => (
                    <div onClick={()=>{
                        // matchDetails(competition.Ccd,competition.Scd,match.T1[0].Nm,match.T2[0].Nm,match.Eid)
                    }} key={j} className="match">
                        <div className="match-time" style={{display:'grid',width:'70px'}}>
                        <div style={{whiteSpace:'nowrap'}}>{convertToDate(match.startDateTimeString.toString())}</div>
                        {match.statusCode === "NS" ? (<>
                            <div>{convertToIST(match.startDateTimeString.toString())}</div>   
                        </>) : match.statusCode !== "FT" &&
                            match.statusCode !== "Canc." &&
                            match.statusCode !== "AP" &&
                            match.statusCode !== "AET" &&
                            match.statusCode !== "HT" ? (
                            <span style={{ color: "red" }}>
                            {match.statusCode.slice(0, -1)}
                            <p className="blink">
                                {match.statusCode.charAt(match.statusCode.length - 1)}
                            </p>
                            </span>
                        ) : (
                            match.StatusCode
                        )}
                        </div>
                        <div style={{ display: "grid" }}>
                        <img
                            className="logo-team1"
                            src={
                            "https://lsm-static-prod.livescore.com/medium/" +
                            match.homeSlug
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
                            match.awaySlug
                            }
                            alt=""
                            onError={(event) =>
                            (event.target.src = require("../../assets/images/pngwing.com.png"))
                            }
                        />
                        </div>
                        <div style={{ display: "grid" }}>
                        <p className="name-team1">{match.homeName}</p>
                        <p className="name-team2">{match.awayName}</p>
                        </div>
                        <div className="score-container" style={{ display: "grid" }}>
                        <p className="score-team1">{match.homeScore}</p>
                        <p className="score-team2">{match.awayScore}</p>
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
                                match.statusCode.charAt(match.statusCode.length - 1) === "'"
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
                </div>
            )):<div style={{border:'1px solid #292c2f',borderRadius:'5px',display:'flex',justifyContent:'center',padding:'10px'}}>No data available</div>}                  
        </TabPanel>
        <TabPanel value="away" sx={{padding:0}}>
            {h2hData?.away?.length?h2hData.away.map((competition, i) => (
                <div key={i}>
                    <div style={{ display: "flex" }}>
                    <div style={{ margin: "12px 5px" }}>
                        <img
                        className="competition-logo"
                        src={"https://static.livescore.com/i2/fh/" +competition.stage.flagUrl +".jpg"}
                        alt=''   
                        onError={(e)=>{e.target.src=require('../../assets/images/flagAlt.webp')}}        
                        />
                    </div>
                    <div>
                        <p
                        style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            marginBottom: 0,
                        }}
                        >
                        {competition.stage.stageName}
                        </p>
                        <p style={{ fontSize: 16 }}>{competition.stage.countryName}</p>
                    </div>
                    </div>
                    {competition.events.map((match, j) => (
                    <div onClick={()=>{
                        // matchDetails(competition.Ccd,competition.Scd,match.T1[0].Nm,match.T2[0].Nm,match.Eid)
                    }} key={j} className="match">
                        <div className="match-time" style={{display:'grid',width:'70px'}}>
                        <div style={{whiteSpace:'nowrap'}}>{convertToDate(match.startDateTimeString.toString())}</div>
                        {match.statusCode === "NS" ? (<>
                            <div>{convertToIST(match.startDateTimeString.toString())}</div>   
                        </>) : match.statusCode !== "FT" &&
                            match.statusCode !== "Canc." &&
                            match.statusCode !== "AP" &&
                            match.statusCode !== "AET" &&
                            match.statusCode !== "HT" ? (
                            <span style={{ color: "red" }}>
                            {match.statusCode.slice(0, -1)}
                            <p className="blink">
                                {match.statusCode.charAt(match.statusCode.length - 1)}
                            </p>
                            </span>
                        ) : (
                            match.StatusCode
                        )}
                        </div>
                        <div style={{ display: "grid" }}>
                        <img
                            className="logo-team1"
                            src={
                            "https://lsm-static-prod.livescore.com/medium/" +
                            match.homeSlug
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
                            match.awaySlug
                            }
                            alt=""
                            onError={(event) =>
                            (event.target.src = require("../../assets/images/pngwing.com.png"))
                            }
                        />
                        </div>
                        <div style={{ display: "grid" }}>
                        <p className="name-team1">{match.homeName}</p>
                        <p className="name-team2">{match.awayName}</p>
                        </div>
                        <div className="score-container" style={{ display: "grid" }}>
                        <p className="score-team1">{match.homeScore}</p>
                        <p className="score-team2">{match.awayScore}</p>
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
                                match.statusCode.charAt(match.statusCode.length - 1) === "'"
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
                </div>
            )):<div style={{border:'1px solid #292c2f',borderRadius:'5px',display:'flex',justifyContent:'center',padding:'10px'}}>No data available</div>}  
        </TabPanel>
    </TabContext>
  )
}

export default H2h