import React, { useContext, useEffect, useState } from 'react'
import './favorites.css'
import { UserContext } from '../../contexts/userContext';
import { Box, Tab, Tooltip } from '@mui/material';
import {ToastContainer,toast} from 'react-toastify'
import axios from 'axios'
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import timestamp from '../../scripts/defaultTimeStamp';

function Favorites({matches}) {
  const [favoriteMatchIds, setFavoriteMatchIds] = useState([])  
  const [tooltipFavorite, setTooltipFavorite] = useState("");
  const [favoriteHovered, setFavoriteHovered] = useState(false);
  const [favoriteMatches, setFavoriteMatches] = useState([])
  const [value, setValue] = React.useState('matches');
  const [favoriteCompetitions, setFavoriteCompetitions] = useState([])
  const [favoriteCompetitionIds, setFavoriteCompetitionIds] = useState([])
  const [favoriteTeams, setFavoriteTeams] = useState([])
  const [favoriteTeamIds, setFavoriteTeamIds] = useState([])
  const {userData,setUserData} = useContext(UserContext) 
  const navigate = useNavigate()

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const addOrRemoveFromFavorites = async (match, e) => {
    const result = await axios.put(
      `${process.env.REACT_APP_SERVER_URL}/add-or-remove-from-favorite-matches`,
      { match: match, userId: userData._id }
    );
    setUserData(result.data.updatedUser);
  };

  const addOrRemoveFromFavoriteCompetitions= async (competition)=>{
    try {
        const result = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/add-or-remove-from-favorite-competitions`,
        { competition:competition, userId: userData._id }                                   
        );
        setUserData(result.data.updatedUser);
    } catch (error) {         
        toast(error)
    }
  }

  const addOrRemoveFromFavoriteTeams= async (team)=>{
    try {
        const result = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/add-or-remove-from-favorite-teams`,
        { team:team, userId: userData._id }
        );
        setUserData(result.data.updatedUser);
    } catch (error) {
        toast(error)
    }
  }

  const removeFinishedFromFavorites = async () => {
    if(favoriteMatches[0].Events){
        const notFinishedMatches = [];    
        favoriteMatches.forEach((match) => {
          match.Events.forEach((event) => {
            if (
              event.Eps.charAt(event.Eps.length - 1) === "'" ||
              event.Eps === "HT"
            ) {
              if (favoriteMatchIds.includes(event.Eid)) {
                notFinishedMatches.push(event.Eid);
              }
            }
          });
        });
        const finishedMatches = favoriteMatchIds.filter(
          (element) => !notFinishedMatches.includes(element)
        );
        try {
            const result = await axios.put(
              `${process.env.REACT_APP_SERVER_URL}/remove-finished-from-favorite-matches`,
              { finishedMatchIds: finishedMatches, userId: userData._id }
            );  
            if(result.data.message!=='No matches to remove'){
                setUserData(result.data.updatedUser);
            }
        } catch (error) {
            toast(error.message)
        }
    }
  };
  
  const fetchMatches = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/fetch-matches`,{params:{defaultTimeStamp:timestamp}})
      .then((res) => {
        setFavoriteMatches(res.data.Stages);
      })
      .catch((error) => {
        toast(error.message);
      });
  };

  const favoriteColorChange = () => {
    const ids = [];
    userData.favorites.matches.forEach((match) => {
      match.match.forEach((singleMatch) => {
        if (!favoriteMatchIds.includes(singleMatch.matchId)) {
          ids.push(singleMatch.matchId);
        }
      });
    });
    setFavoriteMatchIds([...favoriteMatchIds, ...ids]);
  };

  const favoriteCompetitionsColorChange = () => {
    const ids = [];
    userData.favorites.competitions.forEach((competition) => {
        if (!favoriteCompetitionIds.includes(competition.competitionId)) {
          ids.push(competition.competitionId);
        }
    });
    setFavoriteCompetitionIds([...favoriteCompetitionIds, ...ids]);
  };

  const favoriteTeamsColorChange = () => {
    const ids = [];
    userData.favorites.teams.forEach((team) => {
        if (!favoriteTeamIds.includes(team.teamId)) {
          ids.push(team.teamId);
        }
    });
    setFavoriteTeamIds([...favoriteTeamIds, ...ids]);
  };

  const goToCompetitionOverview=(competition,compName)=>{
    const competitionUrl=`${process.env.REACT_APP_COMPETITION_URL}/${competition}/5.30?MD=1`
    axios.get(`${process.env.REACT_APP_SERVER_URL}/competition-overview`,{
        params:{url:competitionUrl}
    }).then(res=>{
        navigate(`/competition-overview/${compName}`,{state:{overview:res.data}})
    })
    .catch(error=>{
        toast(error.message)
    })
  }

  const goToTeamOverview =(teamName,teamId)=>{
    teamName=teamName.replace(' ','-')
    const teamOverviewUrl=`${process.env.REACT_APP_TEAMOVERVIEW_URL}/${teamName}/${teamId}/overview.json?`
    try {     
        axios.get(`${process.env.REACT_APP_SERVER_URL}/team-overview`,{
                    params:{url:teamOverviewUrl}
            }).then(res=>{
                navigate(`/team-overview/${teamName}`,{state:{teamOverview:res.data}})
            })
    } catch (error) {
        toast(error.message)
    }
  }    

  const matchDetails = (competition, stage, team1, team2, eventId) => {
    team1 = team1.toLowerCase().replaceAll(" ", "-");
    team2 = team2.toLowerCase().replaceAll(" ", "-");
    const match = team1 + "-vs-" + team2;
    const matchUrl =`${process.env.REACT_APP_MATCH_URL}/${competition}/${stage}/${match}/${eventId}.json?`;
    navigate(`/match-details`, { state: { matchUrl } });
  };

useEffect(() => {    
    if (userData) {
        setFavoriteCompetitions(userData.favorites.competitions)
        setFavoriteTeams(userData.favorites.teams)
        favoriteColorChange();
        favoriteCompetitionsColorChange()
        favoriteTeamsColorChange()
        fetchMatches();
        setFavoriteMatches(matches)
        const interval = setInterval(() => {
            fetchMatches();
        }, 30000);
        return () => clearInterval(interval);
    }
  }, [userData]);

  useEffect(() => {
    if (favoriteMatches.length !== 0 && userData) {
        removeFinishedFromFavorites();
    }
  }, [favoriteMatches,userData]);
    

  return (
    <>
    <div className='favorites-section'>
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList className='parent-team-overview-tab' onChange={handleChange} aria-label="lab API tabs example" TabIndicatorProps={{ style: { display: 'none' } }}>
                    <Tab label='Matches' value='matches'/>
                    <Tab label='Competitions' value='competitions'/>
                    <Tab label='Teams' value='teams'/>  
                </TabList>   
                </Box>
                <TabPanel value="matches" sx={{padding:0,paddingTop:'10px'}}>
                    {userData?favoriteMatchIds.length!==0?     
                    favoriteMatches.filter(comp=>userData.favorites.matches.some(filter=>filter.competitionId===comp.Sid)).map((competition, i) => (
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
                            {competition.Events.filter(filterMatch=>favoriteMatchIds.includes(filterMatch.Eid)).map((match, j) => (
                            <div
                                onClick={() => {
                                if (!favoriteHovered){
                                    matchDetails(
                                    competition.Ccd,
                                    competition.Scd,
                                    match.T1[0].Nm,
                                    match.T2[0].Nm,
                                    match.Eid
                                    );
                                }}}
                                key={j}   
                                className="match"
                            >
                                <div className="match-time">
                                {match.Eps === "NS" ? (
                                    match.Esd.toString().substring(8, 10) +
                                    ":" +
                                    match.Esd.toString().substring(10, 12)
                                ) : match.Eps !== "FT" &&
                                    match.Eps !== "" &&
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
                                    <Tooltip title={tooltipFavorite} arrow>
                                    <polygon
                                        style={{
                                        fill: favoriteMatchIds.includes(match.Eid)
                                            ? "orangered"
                                            : "transparent",
                                        stroke:
                                            match.Eps.charAt(match.Eps.length - 1) === "'" ||
                                            match.Eps === "HT"
                                            ? favoriteMatchIds.includes(match.Eid)
                                                ? "orangered"
                                                : "white"
                                            : "#706e6e",
                                        }}
                                        onMouseOver={(e) => {
                                        if (
                                            match.Eps.charAt(match.Eps.length - 1) === "'" ||
                                            match.Eps === "HT"
                                        ) {
                                            e.target.style.cursor = "pointer";
                                            e.target.style.zIndex = "1";
                                            e.target.style.fill === "orangered"
                                            ? setTooltipFavorite("Remove from Favorites")
                                            : setTooltipFavorite("Add to Favorites");
                                            setFavoriteHovered(true);
                                        }
                                        }}
                                        onMouseOut={(e) => {
                                        setTooltipFavorite("");
                                        setFavoriteHovered(false);
                                        }}
                                        onClick={(e) => {
                                        if (favoriteMatchIds.includes(match.Eid)) {
                                            const newIds = favoriteMatchIds;
                                            const index = newIds.indexOf(match.Eid);
                                            newIds.splice(index, 1);
                                            setFavoriteMatchIds(newIds);
                                        }
                                        if (
                                            match.Eps.charAt(match.Eps.length - 1) === "'" ||
                                            match.Eps === "HT"
                                        ) {
                                            setTooltipFavorite("");
                                            if (e.target.style.fill !== "orangered") {
                                            e.target.style.fill = "orangered";
                                            e.target.style.stroke = "orangered";
                                            } else {
                                            e.target.style.fill = "transparent";
                                            e.target.style.stroke = "white";
                                            }
                                            const matchObj = {
                                            competition: {
                                                competitionId: competition.Sid,
                                                name: competition.CompN,
                                                stageName: competition.Scd,
                                                competitionImage: competition.Ccd,
                                            },
                                            match: {
                                                matchId: match.Eid,
                                                status: match.Eps,
                                                team1Logo: match.T1[0].Img,
                                                team2Logo: match.T2[0].Img,
                                                team1Name: match.T1[0].Nm,
                                                team2Name: match.T2[0].Nm,
                                                team1Score: match.Tr1,
                                                team2Score: match.Tr2,
                                            },
                                            };
                                            addOrRemoveFromFavorites(matchObj);
                                        }
                                        }}
                                        strokeWidth="1"
                                        points="12,2 15.09,9.3 23.27,9.97 17.27,15.36 18.64,23.05 12,19.13 5.36,23.05 6.73,15.36 0.73,9.97 8.91,9.3"
                                    />
                                    </Tooltip>
                                </svg>
                                </div>
                            </div>
                            ))}
                        </div>
                    ))
                    :(<div style={{border:'1px solid #292c2f',borderRadius:'5px',display:'flex',justifyContent:'center',padding:'5px'}}>No Favorite Matches available</div>)
                    :(<div style={{border:'1px solid #292c2f',borderRadius:'5px',display:'flex',justifyContent:'center',padding:'5px'}}>Please Login</div>)} 
                </TabPanel>
                <TabPanel value="competitions" sx={{padding:0,paddingTop:'10px'}}>
                    {userData?favoriteCompetitions.length!==0?
                    favoriteCompetitions.map((competition, i) => (
                        <div key={i} className="competition" onClick={()=>{
                            if(!favoriteHovered){
                                goToCompetitionOverview(`${competition.stage.toLowerCase()}/${competition.name.toLowerCase().replace(/ /,'-')}`,competition.name.toLowerCase().replace(/ /,'-'))
                            }
                        }}>     
                            <div style={{display:'flex',alignItems:'center'}}>
                                <img
                                className="competition-logo"
                                src={
                                    "https://static.livescore.com/i2/fh/" +
                                    competition.logo +
                                    ".jpg"
                                }
                                alt=""
                                />
                            </div>
                            <div style={{display:'grid',alignItems:'center',marginLeft:'10px'}}>
                                <p
                                style={{
                                    fontSize: 16,
                                    fontWeight: "bold",
                                    marginBottom: 0,
                                }}
                                >
                                {competition.name}
                                </p>
                                <p style={{ fontSize: 16 ,marginBottom: 0,}}>{competition.stage}</p>
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
                                        fill: favoriteCompetitionIds.includes(competition.competitionId)
                                        ? "orangered"
                                        : "transparent",
                                        stroke:favoriteCompetitionIds.includes(competition.competitionId)? "orangered": "white"
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.cursor = "pointer";
                                        e.target.style.zIndex = "1";
                                        e.target.style.fill === "orangered"
                                            ? setTooltipFavorite("Remove from Favorites")
                                            : setTooltipFavorite("Add to Favorites");
                                          setFavoriteHovered(true);
                                    }}
                                    onMouseOut={(e) => {
                                        setTooltipFavorite("");
                                        setFavoriteHovered(false);
                                    }}
                                    onClick={(e) => {
                                        if (favoriteCompetitionIds.includes(competition.competitionId)) {
                                        const newIds = favoriteCompetitionIds;
                                        const index = newIds.indexOf(competition.competitionId);
                                        newIds.splice(index, 1);
                                        setFavoriteCompetitionIds(newIds);
                                        }else{
                                        setFavoriteCompetitionIds([...favoriteCompetitionIds,competition.competitionId]) 
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
                                            competitionId:competition.competitionId,
                                            logo:competition.logo,
                                            name:competition.name,
                                            stage:competition.stage
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
                    )):(<div style={{border:'1px solid #292c2f',borderRadius:'5px',display:'flex',justifyContent:'center',padding:'5px'}}>No Favorite Competitions available</div>)
                    :(<div style={{border:'1px solid #292c2f',borderRadius:'5px',display:'flex',justifyContent:'center',padding:'5px'}}>Please Login</div>)} 
                </TabPanel>
                <TabPanel value="teams" sx={{padding:0,paddingTop:'10px'}}>
                    {userData?favoriteTeams.length!==0?
                    favoriteTeams.map((team, i) => (
                        <div key={i} className="competition" onClick={()=>{
                            if(!favoriteHovered){
                                goToTeamOverview(team.name,team.teamId)    
                                // goToCompetitionOverview(`${competition.stage.toLowerCase()}/${competition.name.toLowerCase().replace(/ /,'-')}`,competition.name.toLowerCase().replace(/ /,'-'))
                            }
                        }}>           
                            <div style={{display:'flex',alignItems:'center'}}>
                                <img
                                className="competition-logo"
                                src={team.logo}
                                alt=""
                                />
                            </div>
                            <div style={{display:'grid',alignItems:'center',marginLeft:'10px'}}>
                                <p
                                style={{
                                    fontSize: 16,
                                    fontWeight: "bold",
                                    marginBottom: 0,
                                }}
                                >
                                {team.name}
                                </p>
                                <p style={{ fontSize: 16 ,marginBottom: 0,}}>{team.country}</p>
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
                                        fill: favoriteTeamIds.includes(team.teamId)
                                        ? "orangered"
                                        : "transparent",
                                        stroke:favoriteTeamIds.includes(team.teamId)? "orangered": "white"
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.cursor = "pointer";
                                        e.target.style.zIndex = "1";
                                        e.target.style.fill === "orangered"
                                            ? setTooltipFavorite("Remove from Favorites")
                                            : setTooltipFavorite("Add to Favorites");
                                          setFavoriteHovered(true);
                                    }}
                                    onMouseOut={(e) => {
                                        setTooltipFavorite("");
                                        setFavoriteHovered(false);
                                    }}
                                    onClick={(e) => {
                                        if (favoriteTeamIds.includes(team.teamId)) {
                                        const newIds = favoriteTeamIds;
                                        const index = newIds.indexOf(team.teamId);
                                        newIds.splice(index, 1);
                                        setFavoriteTeamIds(newIds);
                                        }else{
                                        setFavoriteTeamIds([...favoriteTeamIds,team.teamId]) 
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
                                            teamId:team.teamId,
                                            logo:team.logo,
                                            name:team.name,
                                            stage:team.stage
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
                    )):(<div style={{border:'1px solid #292c2f',borderRadius:'5px',display:'flex',justifyContent:'center',padding:'5px'}}>No Favorite Teams available</div>)
                    :(<div style={{border:'1px solid #292c2f',borderRadius:'5px',display:'flex',justifyContent:'center',padding:'5px'}}>Please Login</div>)} 
                </TabPanel>   
            </TabContext>   
            </Box>
    </div>
    <ToastContainer/>
    </>
  )
}

export default Favorites
