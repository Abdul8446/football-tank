import React, { useContext, useEffect, useState } from 'react'
import './team-overview.css'
import { convertToDate, convertToIST } from '../match-details/convertToIST';
import axios from '../../axios/axios'
import { useNavigate } from 'react-router-dom';
import { getTimeAgo } from '../news-section/getTimeAgo';
import { Box, Button, CircularProgress, Menu, MenuItem, Tab, Tabs, Tooltip } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {ToastContainer,toast} from 'react-toastify'
import { FeaturesContext, UserContext } from '../../contexts/userContext';

function TeamOverview({details}) {
  const navigate=useNavigate()  
  const [teamOverview, setTeamOverview] = useState([])
  const [value, setValue] = React.useState('overview');
  const [matchesLoading, setMatchesLoading] = useState(false)
  const [tablesLoading, setTablesLoading] = useState(false)
  const [newsLoading, setNewsLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)
  const [fixtures, setFixtures] = useState([])
  const [results, setResults] = useState([])
  const [tables, setTables] = useState([])
  const [news, setNews] = useState([])
  const [stats, setStats] = useState([])
  const [matchesValue, setMatchesValue] = React.useState('fixtures');
  const [tablesValue, setTablesValue] = React.useState('all');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const statsMenuOpen = Boolean(anchorEl);
  const [statsStageSelected,setStatsStageSelected] = useState()
  const [statsValue, setStatsValue] = React.useState('all');
  const [goals,setGoals] = useState([])
  const [goalsLoading,setGoalsLoading] = useState(false)
  const [tooltipFavorite, setTooltipFavorite] = useState("");
  const [favoriteTeamIds, setFavoriteTeamIds] = useState([])
  const {userData, setUserData} = useContext(UserContext) 
  const {features} =useContext(FeaturesContext)   
  const [teamTabs, setTeamTabs] = useState(['overview'])   

  const handleStatsChange = (event, newValue) => {
    setStatsValue(newValue);
  };

  const handleStatsMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleStatsMenuClose = (menu) => {
    if(menu.type===undefined){
        getAllDetails(menu.id,menu.href)
        getStatsData(menu.id,menu.href)
        setStatsStageSelected(menu)
    }
    setAnchorEl(null);    
  };
      
  const addOrRemoveFromFavoriteTeams= async (team)=>{
    try {
        const result = await axios.put(
        `/add-or-remove-from-favorite-teams`,
        { team:team, userId: userData._id }
        );
        setUserData(result.data.updatedUser);
    } catch (error) {
        toast(error)
    }
  }

  const favoriteColorChange = () => {
    const ids = [];
    userData.favorites.teams.forEach((team) => {
        if (!favoriteTeamIds.includes(team.teamId)) {
          ids.push(team.teamId);
        }
    });
    setFavoriteTeamIds([...favoriteTeamIds, ...ids]);
  };

  const goToTeamOverview = () => {

  }

  const handleTablesChange = (event, newValue) => {
    setTablesValue(newValue);
  };

  const handleMatchesChange = (event, newValue) => {                                        
    setMatchesValue(newValue);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  useEffect(()=>{
    if(userData!==null  && userData.premiumSubscription.activated===true){
        if(features.teamMatches.premium===true){
            setTeamTabs(prevMenu => [...prevMenu, "matches"])
        }else{
            setTeamTabs(prevMenu => prevMenu.filter(item => item !== "matches")) 
            setValue("overview") 
        }
        if(features.teamTables.premium===true){
            setTeamTabs(prevMenu => [...prevMenu, "tables"])
        }else{
            setTeamTabs(prevMenu => prevMenu.filter(item => item !== "tables"))  
            setValue("overview")
        }
        if(features.teamNews.premium===true){
            setTeamTabs(prevMenu => [...prevMenu, "news"])
        }else{
            setTeamTabs(prevMenu => prevMenu.filter(item => item !== "news"))  
            setValue("overview")
        }
        if(features.teamStats.premium===true){
            setTeamTabs(prevMenu => [...prevMenu, "stats"])
        }else{
            setTeamTabs(prevMenu => prevMenu.filter(item => item !== "stats")) 
            setValue("overview") 
        }
    }
    if((userData===null && features!==null) || userData?.premiumSubscription?.activated===false){
        if(features.teamMatches.normal===true){
            setTeamTabs(prevMenu => [...prevMenu, "matches"])
        }else{
            setTeamTabs(prevMenu => prevMenu.filter(item => item !== "matches"))  
            setValue("overview")
        }
        if(features.teamTables.normal===true){
            setTeamTabs(prevMenu => [...prevMenu, "tables"])
        }else{
            setTeamTabs(prevMenu => prevMenu.filter(item => item !== "tables")) 
            setValue("overview") 
        }       
        if(features.teamNews.normal===true){
            setTeamTabs(prevMenu => [...prevMenu, "news"])
        }else{
            setTeamTabs(prevMenu => prevMenu.filter(item => item !== "news"))
            setValue("overview")
        }
        if(features.teamStats.normal===true){
            setTeamTabs(prevMenu => [...prevMenu, "stats"])
        }else{
            setTeamTabs(prevMenu => prevMenu.filter(item => item !== "stats"))
            setValue("overview")
        }
    }
  },[features,userData])

  useEffect(()=>{
    setTeamOverview(details)
  },[details])   

  const getAllDetails= async (menu,href)=>{
    if(menu==='overview'){
        return
    }
    const fixturesUrl=menu==='matches' && `${process.env.REACT_APP_TEAMOVERVIEW_MENU_URL}${href.slice(0,-1)}.json?`
    const resultsUrl=menu==='matches' && `${process.env.REACT_APP_TEAMOVERVIEW_MENU_URL}${href.slice(0,-9)}results.json?`
    const tablesUrl = menu==='tables' && `${process.env.REACT_APP_TEAMOVERVIEW_MENU_URL}${href.slice(0,-1)}.json?`
    const newsUrl = menu==='news' &&  `${process.env.REACT_APP_TEAMOVERVIEW_MENU_URL}${href.slice(0,-1)}.json?`
    const statsUrl = menu==='stats' && `${process.env.REACT_APP_TEAMOVERVIEW_MENU_URL}${href.slice(0,-1)}.json?`
    const newStatsUrl = menu.type===undefined && `${process.env.REACT_APP_TEAMOVERVIEW_MENU_URL}${href.slice(0,-1)}.json?`
    menu==='matches' && fixtures.length===0 && setMatchesLoading(true);menu==='tables' && tables.length===0 && setTablesLoading(true)
    menu==='news' && news.length===0 && setNewsLoading(true);menu==='stats' && stats.length===0 && setStatsLoading(true)
    const result = await axios.get(`/get-all-team-details`,{
        params:{fixturesUrl:fixturesUrl,resultsUrl:resultsUrl,tablesUrl:tablesUrl,newsUrl:newsUrl,statsUrl:statsUrl,newStatsUrl:newStatsUrl}}
    )
    if(result.data.fixtures){
        setFixtures(result.data.fixtures.pageProps.initialData)
        setResults(result.data.results.pageProps.initialData)
        setMatchesLoading(false)
    }else if(result.data.tables){
        setTables(result.data.tables.pageProps.initialData.leagueTables.league[""])   
        setTablesLoading(false)
    }else if(result.data.news){
        setNews(result.data.news.pageProps.initialArticles)
        setNewsLoading(false)
    }else if(result.data.stats){
        setStats(result.data.stats.pageProps)
        setStatsStageSelected(result.data.stats.pageProps.initialTeamDetails.dropdownStages[0])
        setStatsLoading(false)
    }else if(result.data.newStats){
        setStats(result.data.newStats.pageProps)
        setStatsLoading(false)
    }
  }
    
  const getStatsData= async (menu,href)=>{
    const goalsUrl=`${process.env.REACT_APP_TEAMOVERVIEW_MENU_URL}${href.slice(0,-1)}.json?`
    menu==='goals' && goals.length===0 && setGoalsLoading(true)
    const result = await axios.get(`/get-all-player-stats`,{
        params:{goalsUrl:goalsUrl}}
    )
    if(result.data.goals){
        setGoals(result.data.goals.pageProps)
        setGoalsLoading(false)
    }
  }

  useEffect(()=>{
    if(userData){
        favoriteColorChange()
    }else{
        setFavoriteTeamIds([])
    }
  },[userData])

    
  return ( 
    <>
    {teamOverview.length!==0 && <div className='team-overview-section'>                
        <div style={{ display: "flex" }}>   
            <div style={{ width: "50px" }}>
            <img src={teamOverview.initialData.basicInfo && teamOverview.initialData.basicInfo.badge.high}
                style={{minHeight: "30px",minWidth: "30px",maxHeight: "40px",maxWidth: "40px",borderRadius: "2px"}} alt=""/>
            </div>
            <div style={{ display: "grid" }}>
            <p style={{ fontSize: "16px", fontWeight: "bold", marginBottom: 0 }}>
                {teamOverview.initialData.basicInfo && teamOverview.initialData.basicInfo.name}
            </p>
            <p>{teamOverview.initialData.basicInfo && teamOverview.initialData.basicInfo.country}</p>
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
                        fill: favoriteTeamIds.includes(teamOverview.initialData.basicInfo.id)
                            ? "orangered"
                            : "transparent",
                        stroke:favoriteTeamIds.includes(teamOverview.initialData.basicInfo.id)? "orangered": "white"
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
                        if (favoriteTeamIds.includes(teamOverview.initialData.basicInfo.id)) {
                            const newIds = favoriteTeamIds;
                            const index = newIds.indexOf(teamOverview.initialData.basicInfo.id);
                            newIds.splice(index, 1);
                            setFavoriteTeamIds(newIds);
                        }else{
                            setFavoriteTeamIds([...favoriteTeamIds,teamOverview.initialData.basicInfo.id]) 
                        }
                        setTooltipFavorite("");
                        if (e.target.style.fill !== "orangered") {
                        e.target.style.fill = "orangered";
                        e.target.style.stroke = "orangered";
                        } else {
                        e.target.style.fill = "transparent";
                        e.target.style.stroke = "white";
                        }
                        const teamObj={
                            teamId:teamOverview.initialData.basicInfo.id,
                            logo:teamOverview.initialData.basicInfo.badge.high,
                            name:teamOverview.initialData.basicInfo.name,   
                            country:teamOverview.initialData.basicInfo.country
                        }
                        addOrRemoveFromFavoriteTeams(teamObj)
                        }}
                        strokeWidth="1"
                        points="12,2 15.09,9.3 23.27,9.97 17.27,15.36 18.64,23.05 12,19.13 5.36,23.05 6.73,15.36 0.73,9.97 8.91,9.3"
                    />
                    </Tooltip>
                </svg>
            </div>
        </div>
        <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList className='parent-team-overview-tab' onChange={handleChange} aria-label="lab API tabs example" TabIndicatorProps={{ style: { display: 'none' } }}>
                {teamOverview.teamTabs && teamOverview.teamTabs.filter(menu=>teamTabs.includes(menu.id)).map((menu,i)=>(
                    <Tab key={i} label={menu.id.charAt(0).toUpperCase()+menu.id.slice(1)} value={`${menu.id}`} onClick={()=>{
                        getAllDetails(menu.id,menu.href)
                    }}/>
                ))}    
            </TabList>   
            </Box>
            <TabPanel value="overview" sx={{padding:0,paddingTop:'10px'}}>
                <div style={{marginTop:'5px',marginBottom:'5px'}}>Next Match</div>
                <div style={{width: "100%",background: "#292c2f",borderRadius: "5px",display: "flex",padding: "20px",}}>
                    <div style={{ width: "14.28%", height: "100%" }}>
                    <span style={{ background: "#a39c9c", fontSize: "12px", color: "black" }}>
                        {teamOverview.initialData && teamOverview.initialData.nextOrCurrentMatch.aggregateWinner === "HOME" && "Agg✓"}
                    </span>
                    </div>
                    <div style={{ width: "14.28%", display: "grid", justifyContent: "center" }}>
                    <img src={teamOverview.initialData && teamOverview.initialData.nextOrCurrentMatch.homeTeamBadge.high}style={{ margin: "auto" }}alt=""/>
                    <p style={{fontSize: "10px",fontWeight: "bold",whiteSpace: "nowrap",marginTop: "10px",marginBottom: 0,textAlign:'center'}}>{teamOverview.initialData.nextOrCurrentMatch.homeTeamName}</p>
                    </div>
                    <div style={{ width: "14.28%", height: "100%" }}></div>
                    <div style={{ width: "14.28%", display: "grid", justifyContent: "center" }}>
                    {teamOverview.initialData.nextOrCurrentMatch.eventStatus === "PAST" ? (
                        <>
                        <h1>
                            {teamOverview.initialData.nextOrCurrentMatch.scores.homeTeamScore}-{teamOverview.initialData.nextOrCurrentMatch.scores.awayTeamScore}
                        </h1>
                        <p style={{fontSize: "12px",textAlign: "center",marginBottom: 0}}>{teamOverview.initialData.nextOrCurrentMatch.scores.aggregateHomeScore && "Agg:" +teamOverview.initialData.nextOrCurrentMatch.scores.aggregateHomeScore +"-" +teamOverview.initialData.nextOrCurrentMatch.scores.aggregateAwayScore}</p>
                        <p style={{fontSize: "12px",textAlign: "center",marginBottom: 0,}}>Full Time</p>
                        </>
                    ) : teamOverview.initialData.nextOrCurrentMatch.eventStatus === "LIVE" ? (
                        <>
                        <h1>
                            {teamOverview.initialData.nextOrCurrentMatch.scores.homeTeamScore}-{teamOverview.initialData.nextOrCurrentMatch.scores.awayTeamScore}
                        </h1>
                        <p style={{fontSize: "12px",textAlign: "center",marginBottom: 0,}}>
                            {teamOverview.initialData.nextOrCurrentMatch.aggregateWinner && "Agg:" +teamOverview.initialData.nextOrCurrentMatch.scores.aggregateHomeScore +"-" +teamOverview.initialData.nextOrCurrentMatch.scores.aggregateAwayScore}
                        </p>
                        <span style={{ color: "red", textAlign: "center", marginBottom: 0 }}>
                            {teamOverview.initialData.nextOrCurrentMatch.status.slice(0, teamOverview.initialData.nextOrCurrentMatch.status.length - 1)}
                            <span className="blink">
                            {teamOverview.initialData.nextOrCurrentMatch.status.charAt(teamOverview.initialData.nextOrCurrentMatch.status.length - 1)}
                            </span>
                        </span>
                        </>
                    ) : teamOverview.initialData.nextOrCurrentMatch.eventStatus === "UPCOMING" ? (
                        <>
                        <h1>{convertToIST(teamOverview.initialData.nextOrCurrentMatch.startDateTimeString)}</h1>
                        <p style={{fontSize: "12px",textAlign: "center",marginBottom: 0,}}>
                            {teamOverview.initialData.nextOrCurrentMatch.scores.aggregateHomeScore && "Agg:" +teamOverview.initialData.nextOrCurrentMatch.scores.aggregateHomeScore +"-" +teamOverview.initialData.nextOrCurrentMatch.scores.aggregateAwayScore}
                        </p>
                        <span style={{fontSize: "12px",textAlign: "center",marginBottom: 0,}}>
                            {convertToDate(teamOverview.initialData.nextOrCurrentMatch.startDateTimeString)}
                        </span>
                        </>
                    ) : (
                        <></>
                    )}
                    </div>
                    <div style={{ width: "14.28%", height: "100%" }}></div>
                    <div style={{ width: "14.28%", display: "grid", justifyContent: "center" }}>
                    <img src={teamOverview.initialData.nextOrCurrentMatch.awayTeamBadge.high} style={{ margin: "auto" }} alt=""/>
                    <p style={{fontSize: "10px",textAlign:'center',fontWeight: "bold",whiteSpace: "nowrap",marginTop: "10px",marginBottom: 0,}}>{teamOverview.initialData.nextOrCurrentMatch.awayTeamName}</p>
                    </div>
                    <div style={{width: "14.28%",height: "100%",display: "flex",alignItems: "end",}}>
                    <span style={{background: "#a39c9c",fontSize: "12px",color: "black",marginLeft: "auto"}}>{teamOverview.initialData.nextOrCurrentMatch.aggregateWinner === "AWAY" && "✓Agg"}</span>
                    </div>
                </div>
                <div style={{marginTop:'5px',marginBottom:'5px'}}>Form</div>
                {teamOverview.initialData.results && teamOverview.initialData.results.map((match, j) => (
                    <div onClick={()=>{
                        // matchDetails(competition.Ccd,competition.Scd,match.T1[0].Nm,match.T2[0].Nm,match.Eid)
                        }} key={j} className="match">    
                        <div style={{ display: "grid" }}>
                            <img
                            className="logo-team1"
                            src={match.homeTeamBadge.high}
                            alt=""
                            onError={(event) =>
                                (event.target.src = require("../../assets/images/pngwing.com.png"))
                            }
                            />
                            <img
                            className="logo-team2"
                            src={match.awayTeamBadge.high}
                            alt=""
                            onError={(event) =>
                                (event.target.src = require("../../assets/images/pngwing.com.png"))
                            }
                            />
                        </div>
                        <div style={{ display: "grid" }}>
                            <p className="name-team1">{match.homeTeamName}</p>
                            <p className="name-team2">{match.awayTeamName}</p>
                        </div>
                        <div className="score-container" style={{ display: "grid" }}>
                            <p className="score-team1">{match.homeTeamScore}</p>
                            <p className="score-team2">{match.awayTeamScore}</p>
                        </div>
                        <div className="fav-star">
                        </div>
                    </div>
                ))}
                <div className='seeall' style={{marginBottom:'10px'}}>See All</div>
                {teamOverview.initialArticles && <div style={{marginTop:'5px',marginBottom:'5px'}}>News</div>}
                {teamOverview.initialArticles && teamOverview.initialArticles.map((news,i)=>(
                    <div key={i} style={{display:'flex',marginBottom:'10px',marginTop:'10px'}}>   
                        <img src={news.mainMedia.gallery.url} height='100px' width='150px' style={{borderRadius:'5px'}} alt=''/>
                        <span style={{fontWeight:'bold',marginLeft:'10px'}}>{news.title}</span>
                    </div>
                ))}
                {teamOverview.initialArticles && <div className='seeall' style={{marginTop:'10px'}}>See All</div>}
            </TabPanel>
            {teamTabs.includes("matches")?<TabPanel value="matches" sx={{padding:0,paddingTop:'10px'}}>
                <>
                {matchesLoading && <Box sx={{ display: 'flex' ,justifyContent:"center"}}><CircularProgress /></Box>}
                {fixtures.length!==0 && <Box sx={{ width: '100%', typography: 'body1',marginTop:'10px' }}>
                    <TabContext value={matchesValue}>
                        <Box>
                        <TabList className='team-overview-matches-tab' onChange={handleMatchesChange} aria-label="lab API tabs example"  TabIndicatorProps={{ style: { display: 'none' } }}>
                            <Tab label="Fixtures" value="fixtures" />
                            <Tab label="Results" value="results" />
                        </TabList>
                        </Box>
                        <TabPanel value="fixtures" sx={{padding:0}}> 
                            {fixtures.eventsByMatchType.map((competition, i) => (
                            <div key={i}>
                                <div style={{ display: "flex" }}>
                                <div style={{ margin: "12px 5px" }}>
                                    <img
                                    className="competition-logo"
                                    src={
                                        "https://static.livescore.com/i2/fh/" +
                                        competition.Ccd +
                                        ".jpg"
                                    }
                                    alt=""
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
                                    {competition.Snm}
                                    </p>
                                    <p style={{ fontSize: 16 }}>{competition.Cnm}</p>
                                </div>
                                </div>
                                {competition.Events.map((match, j) => (
                                <div onClick={()=>{
                                    // matchDetails(competition.Ccd,competition.Scd,match.T1[0].Nm,match.T2[0].Nm,match.Eid)
                                }} key={j} className="match">
                                    <div className="match-time" style={{display:'grid',width:'70px'}}>
                                    {/* <p>{convertToDate()}</p>     */}                       
                                    {match.Eps === "NS" ? (<>
                                        <div style={{whiteSpace:'nowrap'}}>{convertToDate(match.Esd.toString())}</div>
                                        <div>{convertToIST(match.Esd.toString())}</div>
                                    </>) : match.Eps !== "FT" &&
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
                            </div>
                            ))}   
                        </TabPanel>
                        <TabPanel value="results" sx={{padding:0}}>
                            {results.eventsByMatchType.map((competition, i) => (
                                <div key={i}>
                                    <div style={{ display: "flex" }}>
                                    <div style={{ margin: "12px 5px" }}>
                                        <img
                                        className="competition-logo"
                                        src={
                                            "https://static.livescore.com/i2/fh/" +
                                            competition.Ccd +
                                            ".jpg"
                                        }
                                        alt=""
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
                                        {competition.Snm}
                                        </p>
                                        <p style={{ fontSize: 16 }}>{competition.Cnm}</p>
                                    </div>
                                    </div>
                                    {competition.Events.map((match, j) => (
                                    <div onClick={()=>{
                                        // matchDetails(competition.Ccd,competition.Scd,match.T1[0].Nm,match.T2[0].Nm,match.Eid)
                                    }} key={j} className="match">
                                        <div className="match-time" style={{display:'grid',width:'70px'}}>
                                        {/* <p>{convertToDate()}</p>     */}                       
                                        <div style={{whiteSpace:'nowrap'}}>{convertToDate(match.Esd.toString())}</div>
                                        {match.Eps === "NS" ? (<>
                                            <div>{convertToIST(match.Esd.toString())}</div>   
                                        </>) : match.Eps !== "FT" &&
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
                                </div>
                            ))}  
                        </TabPanel>
                    </TabContext>
                </Box>}              
                </>       
            </TabPanel>:''}
            {teamTabs.includes("tables")?<TabPanel value="tables" sx={{padding:0,paddingTop:'10px'}}>
                <>
                {tablesLoading && <Box sx={{ display: 'flex' ,justifyContent:"center"}}><CircularProgress /></Box>}
                {tables.length!==0 && <Box sx={{ width: '100%', typography: 'body1',marginTop:'10px' }}>
                    <TabContext value={tablesValue}>
                        <Box>
                        <TabList className='team-overview-matches-tab' onChange={handleTablesChange} aria-label="lab API tabs example"  TabIndicatorProps={{ style: { display: 'none' } }}>
                            <Tab label="All" value="all" />
                            <Tab label="Home" value="home" />
                            <Tab label="Away" value="away" />
                        </TabList>
                        </Box>
                        {tables.map((table,i)=>(
                            <TabPanel key={i} value={`${table.kind}`} sx={{padding:0}}> 
                            <div style={{display: "grid",borderRadius: "5px",border: "1px solid #292c2f",paddingBottom:"10px",paddingTop:"10px"}}>
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
                                        {table.teams.map((team,i)=>(
                                            <>
                                            <tr style={{borderTop:'1px solid rgb(41, 44, 47)'}}>
                                                <td style={{textAlign:'center'}}>{team.rank}</td>
                                                <td onClick={()=>
                                                    goToTeamOverview(team.name,team.id)
                                                }><img src={team.teamBadge.high} alt="" height='25px' width='25px'/> {team.name}</td>
                                                <td style={{textAlign:'center'}}>{team.played}</td>
                                                <td style={{textAlign:'center'}}>{team.wins}</td>
                                                <td style={{textAlign:'center'}}>{team.draws}</td>
                                                <td style={{textAlign:'center'}}>{team.losses}</td>
                                                <td style={{textAlign:'center'}}>{team.goalsFor}</td>
                                                <td style={{textAlign:'center'}}>{team.goalsAgainst}</td>
                                                <td style={{textAlign:'center'}}>{team.goalsDiff}</td>
                                                <td style={{textAlign:'center'}}>{team.points || team.ptsn}</td>
                                            </tr>
                                            </>         
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            </TabPanel>
                        ))}
                    </TabContext>
                </Box>}
                </>                            
            </TabPanel>:''}   
            {teamTabs.includes("news")?<TabPanel value="news" sx={{padding:0,paddingTop:'10px'}}>
                {newsLoading && <Box sx={{ display: 'flex' ,justifyContent:"center"}}><CircularProgress /></Box>}
                {news.length !==0 && news.map((news,i)=>(
                    <div key={i} className='news-title' 
                    // onClick={()=>navigate(`/news/${news.id}`,{state:{news}})}
                    >    
                    <img src={news.mainMedia.thumbnail.url} alt="" width='130px' height='80px' style={{borderRadius:'5px'}}/>   
                    <div style={{fontWeight:'bold',marginLeft:'10px',maxWidth:'60%'}}>{news.title}</div>
                    <div style={{marginLeft:'auto'}}>{getTimeAgo(news.publishedAt)}</div>
                    </div>     
                ))}
            </TabPanel>:''}
            {teamTabs.includes("stats")?<TabPanel value="stats" sx={{padding:0,paddingTop:'10px'}}>
                {statsLoading && <Box sx={{ display: 'flex' ,justifyContent:"center"}}><CircularProgress /></Box>}
                {stats.length!==0 && <>
                <div style={{display:'flex',marginBottom:'10px'}}>
                    <Button
                        id="basic-button"
                        aria-controls={statsMenuOpen ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={statsMenuOpen ? 'true' : undefined}
                        onClick={handleStatsMenuClick}
                    >
                        <img src={statsStageSelected.iconUrl} alt="" style={{minHeight:'20px',maxWidth:'30px'}}/> 
                        &nbsp;<span>{statsStageSelected.name}</span>  
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={statsMenuOpen}
                        onClose={handleStatsMenuClose}
                        MenuListProps={{
                        'aria-labelledby': 'basic-button',
                        }}
                    >             
                        {stats.initialTeamDetails.dropdownStages.map((menu,i)=>(
                            <MenuItem sx={{background:'#292c2f',overflowY:'hidden'}} key={i} onClick={()=>handleStatsMenuClose(menu)}>
                                <img src={menu.iconUrl} alt="" style={{minHeight:'20px',maxWidth:'30px'}}/> 
                                &nbsp;<span>{menu.name}</span>
                            </MenuItem>
                        ))} 
                    </Menu>
                </div>
                <TabContext sx={{width:'100%'}} value={statsValue}>
                        <Box>
                            <Tabs className='team-overview-stats-tab' 
                                value={statsValue}
                                onChange={handleStatsChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                aria-label="scrollable auto tabs example"
                                TabIndicatorProps={{ style: { display: 'none' } }}
                            >
                                {stats.initialPlayerStats.tabs.map((menu,i)=>(
                                <Tab key={i} label={`${menu.id===''?menu.name:menu.id.replace(/-/g,' ')}`} value={`${menu.id===''?menu.name:menu.id}`} onClick={()=>{
                                    getStatsData(menu.id,menu.href)
                                }}/>
                                ))} 
                            </Tabs>
                        </Box>
                        <TabPanel value={`${stats.initialPlayerStats.tabs[0].id===''?stats.initialPlayerStats.tabs[0].name:stats.initialPlayerStats.tabs[0].id}`} sx={{padding:0}}> 
                            {stats.initialPlayerStats.stats.map((stat,i)=>(
                                <div key={i}>
                                    <div style={{textTransform:'uppercase',marginBlock:'5px'}}>{stat.statId.replace(/-/g,' ')}</div>
                                    <div style={{display: "grid",borderRadius: "5px",border: "1px solid #292c2f"}}>
                                        {stat.players.map((player,j)=>(
                                            <>
                                            <div style={{display:'flex',paddingTop:'5px',paddingBottom:'5px'}}>
                                                <div style={{width:'30px',display:'flex',justifyContent:'end',alignItems:'center'}}>
                                                    {player.rank}
                                                </div>
                                                <div style={{width:'50px',display:'flex',justifyContent:'center',alignItems:'center'}}>
                                                    <img src={player.teamBadge.high} height='30px' width='30px' alt="" />
                                                </div>
                                                <div style={{display:'grid'}}>
                                                    <span style={{fontWeight:'bold'}}>{player.name}</span>
                                                    <span>{player.teamName}</span>
                                                </div>
                                                <div style={{fontWeight:'bold',marginLeft:'auto',marginRight:'10px',display:'flex',alignItems:'center'}}>
                                                    {player.statAmount}
                                                </div>
                                            </div>
                                            <hr style={{marginTop:0,marginBottom:0}}/>
                                            </>   
                                        ))}
                                        <div style={{display:'flex',justifyContent:'center',paddingTop:'5px',paddingBottom:'5px'}}>See All</div>
                                    </div>
                                </div>
                            ))}
                        </TabPanel>
                        {goalsLoading && <Box sx={{ display: 'flex' ,justifyContent:"center"}}><CircularProgress /></Box>}
                        {goals.length!==0 && goals.initialPlayerStats.stats.map((stat,i)=>(
                            <div key={i}>
                            <TabPanel value={`${stat.statId}`} sx={{padding:0}}> 
                                <div style={{textTransform:'uppercase',marginBlock:'5px'}}>{stat.statId.replace(/-/g,' ')}</div>
                                <div style={{display: "grid",borderRadius: "5px",border: "1px solid #292c2f"}}>
                                    {stat.players.map((player,j)=>(
                                        <div key={j}>
                                        <div style={{display:'flex',paddingTop:'5px',paddingBottom:'5px'}}>
                                            <div style={{width:'30px',display:'flex',justifyContent:'end',alignItems:'center'}}>
                                                {player.rank}
                                            </div>
                                            <div style={{width:'50px',display:'flex',justifyContent:'center',alignItems:'center'}}>
                                                <img src={player.teamBadge.high} height='30px' width='30px' alt="" />
                                            </div>
                                            <div style={{display:'grid'}}>
                                                <span style={{fontWeight:'bold'}}>{player.name}</span>
                                                <span>{player.teamName}</span>
                                            </div>
                                            <div style={{fontWeight:'bold',marginLeft:'auto',marginRight:'10px',display:'flex',alignItems:'center'}}>
                                                {player.statAmount}
                                            </div>
                                        </div>
                                        <hr style={{marginTop:0,marginBottom:0}}/>
                                        </div>   
                                    ))}
                                </div>
                            </TabPanel>
                            </div>
                        ))}
                </TabContext>
                </>}
            </TabPanel>:''}
        </TabContext>   
        </Box>
    </div>}
    <ToastContainer/>
    </>     
  )
}

export default TeamOverview
