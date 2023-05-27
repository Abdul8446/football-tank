import React, { useState, useEffect, useContext } from "react";
import axios from "../../axios/axios";
import "./matches.css";
import dates from "./dates";
import generateTimeStamp from "./generateTimeStamp";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { FeaturesContext, UserContext } from "../../contexts/userContext";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { convertToDate, convertToIST } from "../match-details/convertToIST";
import timestamp from "../../scripts/defaultTimeStamp";
import { ToastContainer, toast } from "react-toastify";

function Matches() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState(true);  
  const [matchesDate, setMatchesDate] = useState([]);
  const [live, setLive] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [tooltipFavorite, setTooltipFavorite] = useState("");
  const [favoriteHovered, setFavoriteHovered] = useState(false);
  const [favoriteMatchIds, setFavoriteMatchIds] = useState([]);
  const { userData, setUserData } = useContext(UserContext);
  const {matches, setMatches} = useContext(FeaturesContext)
  const [selectedDate, setSelectedDate] = useState(null);
  const [favoriteCompetitionIds,setFavoriteCompetitionIds] =useState([])
  const [favoriteTeamIds, setFavoriteTeamIds] =useState([])
  const [welcomeBannerUrl, setWelcomeBannerUrl] = useState()
  const welcomeUrls=[
    require('../../assets/images/welcomebanner1.jpg'),
    require('../../assets/images/welcomebanner2.jpg'),
    require('../../assets/images/welcomebanner3.jpg'),
    require('../../assets/images/welcomebanner4.jpg'),
    require('../../assets/images/welcomebanner5.avif'),
    require('../../assets/images/welcomebanner6.jpg'),
    require('../../assets/images/welcomebanner7.jpg'),
    require('../../assets/images/welcomebanner8.jpg'),
    require('../../assets/images/welcomebanner9.jpg'),
    require('../../assets/images/welcomebanner10.jpg'),
    require('../../assets/images/welcomebanner11.jpg'),
    require('../../assets/images/welcomebanner12.jpg'),
    require('../../assets/images/welcomebanner13.jpg'),
    require('../../assets/images/welcomebanner14.jpg'),
    require('../../assets/images/welcomebanner15.jpg'),
  ]

  const handleDateChange = (date) => {
    let month = date.$M + date.$W;
    if (month < 10) {
      if (date.$D < 10 && month < 10) {
        month = "0" + month;
        date.$D = "0" + date.$D;
      } else {
        month = "0" + month;
      }
    } else if (date.$D < 10) {
      date.$D = "0" + date.$D;
    }
    matchesByDate(date.$y + "" + month + "" + date.$D);
    setSelectedDate(date);
  };

  const addOrRemoveFromFavorites = async (match, e) => {
    const result = await axios.put(
      `/add-or-remove-from-favorite-matches`,
      { match: match, userId: userData._id }
    );
    setUserData(result.data.updatedUser);
  };

  const removeFinishedFromFavorites = async () => {
    const notFinishedMatches = [];
    matches.forEach((match) => {
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
    const result = await axios.put(
      `/remove-finished-from-favorite-matches`,
      { finishedMatchIds: finishedMatches, userId: userData._id }
    );  
    setUserData(result.data.updatedUser);
  };

  const setActiveButton = (e) => {
    const buttons = document.querySelectorAll(".nav-links");
    buttons.forEach((button) => {
      if (button.classList.contains("active")) {
        button.classList.remove("active");
      }
    });
    e.target.classList.add("active");
  };

  const setActiveInitial = () => {
    const buttons = document.querySelectorAll(".date");
    const button = buttons[Math.floor(buttons.length / 2)];
    button.classList.add("active");
    if (!button.innerHTML.includes("TODAY")) {
      button.innerHTML = "TODAY" + button.innerHTML.slice(3);
      setToday(true);
    } else {
      setToday(false);
    }
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

  const makeFavoriteCompetitionsArray = () => {
    const ids = [];
    userData.favorites.competitions.forEach((competition) => {
        if (!favoriteCompetitionIds.includes(competition.competitionId)) {
          ids.push(competition.competitionId);
        }
    });
    setFavoriteCompetitionIds([...favoriteCompetitionIds, ...ids]);
  };

  const makeFavoriteTeamsArray = () => {
    const ids = [];
    userData.favorites.teams.forEach((team) => {
        if (!favoriteTeamIds.includes(team.teamId)) {
          ids.push(team.teamId);
        }
    });
    setFavoriteTeamIds([...favoriteTeamIds, ...ids]);
  };

  const revertToTodayMatches = () => {
    const buttons = document.querySelectorAll(".date");
    const button = buttons[Math.floor(buttons.length / 2)];
    if (today) {
      button.classList.remove("active");
      setToday(false);
      return;
    }
    if (button.classList.contains("active")) {
      setToday(true);
    } else {
      setToday(false);
    }
  };

  const matchDetails = (competition, stage, team1, team2, eventId) => {
    team1 = team1.toLowerCase().replaceAll(" ", "-");
    team2 = team2.toLowerCase().replaceAll(" ", "-");
    const match = team1 + "-vs-" + team2;
    const matchUrl = process.env.REACT_APP_MATCH_URL+`/${competition}/${stage}/${match}/${eventId}.json?`;
    navigate(`/match-details`, { state: { matchUrl } });
  };       

  const matchesLive = () => {
    axios
      .get(`/fetch-matches`,{params:{defaultTimeStamp:timestamp}})
      .then((res) => {
        const liveMatches = res.data.Stages.map((item) => {
          const Events = item.Events.filter(
            (event) =>
              event.Eps.charAt(event.Eps.length - 1) === "'" ||
              event.Eps === "HT"
          );
          return { ...item, Events };
        }).filter((filteredItem) => filteredItem.Events.length > 0);
        setLive(liveMatches);
        setIsLive(true);
        setToday(false);
        setLoading(false);
      })
      .catch((error) => {
        toast(error.message);
      });
  };

  const matchesByDate = (day, date, month) => {
    let timeStamp;
    if (date === undefined) {
      timeStamp = day;
    } else {
      timeStamp = generateTimeStamp(day, date, month);
    }
    axios
      .get(`/fetch-matches`, {
        params: {
          timeStamp: timeStamp,
        },
      })
      .then((res) => {
        revertToTodayMatches();
        setIsLive(false);
        setMatchesDate(res.data.Stages);
        setLoading(false);
      })
      .catch((error) => {
        toast(error.message);
      });
  };

  useEffect(() => {
    setActiveInitial()
  }, []);

  useEffect(() => {
    if (userData) {
      favoriteColorChange();
      makeFavoriteCompetitionsArray()
      makeFavoriteTeamsArray()
    }
  }, [userData]);

  useEffect(()=>{
    setWelcomeBannerUrl(welcomeUrls[Math.floor(Math.random() * welcomeUrls.length)])
  },[navigate])

  useEffect(() => {
    const interval = setInterval(() => {
      if (isLive) {
        if (favoriteMatchIds.length !== 0) {
          removeFinishedFromFavorites();
        }
        matchesLive();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [isLive]);

  useEffect(() => {
    // initial load
    fetchMatches();

    //set interval for polling every 30 seconds
    const interval = setInterval(() => {
      if (today) {
        fetchMatches();
      }
    }, 30000);

    // clear interval on unmount
    return () => clearInterval(interval);
  }, [today]);

  const fetchMatches = async () => {
    try {
      let result= await axios.get(`/fetch-matches`,{params:{defaultTimeStamp:timestamp}})
      setMatches(result.data.Stages);
      setLoading(false);
    } catch (error) {
      fetchMatches()
    }
  };

  return (
    <>
    <div className="matches-section">
      <div className="matches-section-title">
        <button
          onClick={(e) => {
            setActiveButton(e);
            matchesLive();
          }}
          className="live nav-links"
        >
          LIVE
        </button>
        {dates.map((date, i) => (
          <button
            key={i}
            className="date nav-links"
            onClick={(e) => {
              setActiveButton(e);
              matchesByDate(date.day, date.date, date.month);
            }}
          >
            {date.day}
            <br />
            {date.date} {date.month}
          </button>
        ))}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            id="datepicker"
            value={selectedDate}
            onChange={handleDateChange}
            // sx={{ display: 'none',position:'absolute' }}
            slotProps={{
              textField: {
                variant: "standard",
                InputProps: { disableUnderline: true },
              },
            }}
          />
        </LocalizationProvider>
      </div>
      <hr style={{ color: "white" }} />     
      <div style={{
        backgroundImage:`url(${welcomeBannerUrl})`,
        backgroundSize:'cover',height:'150px',width:'100%',display:'flex',justifyContent:'end',
        alignItems:'end',marginBottom:'10px'
      }}>
        <h3 style={{fontStyle:'italic',marginRight:'10px'}}>Welcome to Football-Tank</h3>
      </div>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        ""
      )}
      {/* ==========================================today's matches */}
      {today === true ? (
        <>
          {matches.filter(comp=>comp.Events.some(match=>favoriteTeamIds.includes(match.T1[0].ID)||favoriteTeamIds.includes(match.T2[0].ID))).map(comp=>(
            comp.Events.filter(event=>favoriteTeamIds.includes(event.T1[0].ID)||favoriteTeamIds.includes(event.T2[0].ID)).map(match=>(
              <div style={{width: "100%",background: "#292c2f",cursor:'pointer',borderRadius: "5px",display: "flex",padding: "20px",marginBottom:'10px'}} onClick={()=>{
                matchDetails(comp.Ccd,comp.Scd,match.T1[0].Nm,match.T2[0].Nm,match.Eid)
              }}>
                  <div style={{ width: "14.28%", height: "100%" }}>
                  <span style={{ background: "#a39c9c", fontSize: "12px", color: "black" }}>
                      {/* {details.aggregateWinner === "HOME" && "Agg✓"} */}
                  </span>
                  </div>
                  <div style={{ width: "14.28%", display: "grid", justifyContent: "center" }}>
                  <img src={match.T1[0].Img?"https://lsm-static-prod.livescore.com/medium/"+match.T1[0].Img:require("../../assets/images/pngwing.com.png")}style={{ margin: "auto" }} alt=""/>
                  <p style={{fontSize: "10px",fontWeight: "bold",whiteSpace: "nowrap",marginTop: "10px",marginBottom: 0,textAlign:'center'}}>{match.T1[0].Nm}</p>
                  </div>
                  <div style={{ width: "14.28%", height: "100%" }}></div>
                  <div style={{ width: "14.28%", display: "grid", justifyContent: "center" }}>
                  {match.Eps === "FT" ? (
                      <>
                      <h1>
                          {match.Tr1}-{match.Tr2}
                      </h1>
                      {/* <p style={{fontSize: "12px",textAlign: "center",marginBottom: 0}}>{details.scores.aggregateHomeScore && "Agg:" +details.scores.aggregateHomeScore +"-" +details.scores.aggregateAwayScore}</p> */}
                      <p style={{fontSize: "12px",textAlign: "center",marginBottom: 0,}}>Full Time</p>
                      </>
                  ) : match.Eps.charAt(match.Eps.length-1) === "'" ? (
                      <>
                      <h1>
                          {match.Tr1}-{match.Tr2}
                      </h1>
                      <p style={{fontSize: "12px",textAlign: "center",marginBottom: 0,}}>
                          {/* {details.aggregateWinner && "Agg:" +details.scores.aggregateHomeScore +"-" +details.scores.aggregateAwayScore} */}
                      </p>
                      <span style={{ color: "red", textAlign: "center", marginBottom: 0 }}>
                          {match.Eps.slice(0, match.Eps.length - 1)}
                          <span className="blink">
                          {match.Eps.charAt(match.Eps.length - 1)}
                          </span>
                      </span>
                      </>
                  ) : match.Eps === "NS" ? (
                      <>
                      <h1>{convertToIST(match.Esd.toString())}</h1>
                      <p style={{fontSize: "12px",textAlign: "center",marginBottom: 0,}}>
                          {/* {details.scores.aggregateHomeScore && "Agg:" +details.scores.aggregateHomeScore +"-" +details.scores.aggregateAwayScore} */}
                      </p>
                      <span style={{fontSize: "12px",textAlign: "center",marginBottom: 0,}}>
                          {convertToDate(match.Esd)}
                      </span>
                      </>
                  ) : (
                      <></>
                  )}
                  </div>
                  <div style={{ width: "14.28%", height: "100%" }}></div>
                  <div style={{ width: "14.28%", display: "grid", justifyContent: "center" }}>
                  <img src={match.T2[0].Img?"https://lsm-static-prod.livescore.com/medium/"+match.T2[0].Img:require("../../assets/images/pngwing.com.png")} style={{ margin: "auto" }} alt=""/>
                  <p style={{fontSize: "10px",textAlign:'center',fontWeight: "bold",whiteSpace: "nowrap",marginTop: "10px",marginBottom: 0,}}>{match.T2[0].Nm}</p>
                  </div>
                  <div style={{width: "14.28%",height: "100%",display: "flex",alignItems: "end",}}>
                  {/* <span style={{background: "#a39c9c",fontSize: "12px",color: "black",marginLeft: "auto"}}>{details.aggregateWinner === "AWAY" && "✓Agg"}</span> */}
                  </div>
              </div>
            ))
          ))}
          {matches.filter(comp=>favoriteCompetitionIds.includes(comp.Sid))
          .concat(matches.filter(comp=>!favoriteCompetitionIds.includes(comp.Sid)))
          .map((competition, i) => (
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
                <div
                  onClick={() => {
                    if (!favoriteHovered)
                      matchDetails(
                        competition.Ccd,
                        competition.Scd,
                        match.T1[0].Nm,
                        match.T2[0].Nm,
                        match.Eid
                      );
                  }}
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
          ))}
        </>
      ) : //===========================================LIVE matches
      isLive === true ? (
        <>
          {live.filter(comp=>favoriteCompetitionIds.includes(comp.Sid))
          .concat(live.filter(comp=>!favoriteCompetitionIds.includes(comp.Sid)))
          .map((competition, i) => (
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
                <div
                  key={j}
                  onClick={() => {
                    if (!favoriteHovered)
                      matchDetails(
                        competition.Ccd,
                        competition.Scd,
                        match.T1[0].Nm,
                        match.T2[0].Nm,
                        match.Eid
                      );
                  }}
                  className="match"
                >
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
          ))}
        </>
      ) : (
        //===============================================Matches by date
        <>
          {matchesDate.filter(comp=>favoriteCompetitionIds.includes(comp.Sid))
          .concat(matchesDate.filter(comp=>!favoriteCompetitionIds.includes(comp.Sid)))
          .map((competition, i) => (
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
                <div
                  key={j}
                  onClick={() => {
                    matchDetails(
                      competition.Ccd,
                      competition.Scd,
                      match.T1[0].Nm,
                      match.T2[0].Nm,
                      match.Eid
                    );
                  }}
                  className="match"
                >
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
                        fill="transparent"
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
        </>
      )}
    </div>
    <ToastContainer/>
    </>
  );
}

export default Matches;
