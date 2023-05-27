import React, { useState, useEffect, useContext, useRef } from "react";
import { convertToIST, convertToDate } from "./convertToIST";
import "./match-details.css";
import MatchSummary from "../match-summary/MatchSummary";
import axios from "../../axios/axios";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import MatchInfo from "../match-info/MatchInfo";
import MatchStats from "../match-stats/MatchStats";
import LiveChat from "../live-chat/LiveChat";
import { FeaturesContext, UserContext } from "../../contexts/userContext";
import {toast , ToastContainer} from 'react-toastify'
import LineUps from "../line-ups/LineUps";
import H2h from "../h2h/H2h";


function MatchDetails({ matchUrl }) {
  const [summary, setSummary] = useState(false);
  const [info, setInfo] = useState(false);
  const [stats, setStats] = useState(false);
  const [liveChat, setLiveChat] = useState(false);
  const [details, setDetails] = useState(null);
  const [infoData, setInfoData] = useState([]);
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lineUps, setLineUps] = useState(false)
  const [lineUpsData, setLineUpsData] = useState([])
  const [h2h, setH2h] = useState(false)
  const [h2hData, setH2hData] = useState([])
  const { userData } = useContext(UserContext);
  const {features} = useContext(FeaturesContext)
  const [upComingMenu, setUpComingMenu]=useState(["Info", "Summary"])
  const [pastOrLiveMenu, setPastOrLiveMenu] = useState(["Info", "Summary"])

//   const upComingMenu = ["Info", "Summary", "Line-ups", "H2H"];
//   const pastOrLiveMenu = ["Info", "Summary", "Stats", "Line-ups", "H2H"];


  useEffect(()=>{
    console.log(userData,'user   ddata')
    if(userData!==null  && userData?.premiumSubscription?.activated===true){
      console.log('userdata is not null')
        if(features.matchStats.premium===true){
            setPastOrLiveMenu(prevMenu => [...prevMenu, "Stats"])
        }else{
            setPastOrLiveMenu(prevMenu => prevMenu.filter(item => item !== "Stats"))  
        }       
        if(features.matchLineUps.premium===true){
            setPastOrLiveMenu(prevMenu => [...prevMenu, "Line-ups"])
            setUpComingMenu(prevMenu => [...prevMenu, "Line-ups"])
        }else{
            setPastOrLiveMenu(prevMenu => prevMenu.filter(item => item !== "Line-ups"))
            setUpComingMenu(prevMenu => prevMenu.filter(item => item !== "Line-ups"))
        }
        if(features.matchH2h.premium===true){
            setPastOrLiveMenu(prevMenu => [...prevMenu, "H2H"])
            setUpComingMenu(prevMenu => [...prevMenu, "H2H"])
        }else{
            setPastOrLiveMenu(prevMenu => prevMenu.filter(item => item !== "H2H"))
            setUpComingMenu(prevMenu => prevMenu.filter(item => item !== "H2H"))
        }
    }
    if((userData===null && features!==null) || userData?.premiumSubscription?.activated===false){
        if(features.matchStats.normal===true){
            setPastOrLiveMenu(prevMenu => [...prevMenu, "Stats"])
        }else{
            setPastOrLiveMenu(prevMenu => prevMenu.filter(item => item !== "Stats"))  
        }       
        if(features.matchLineUps.normal===true){
            setPastOrLiveMenu(prevMenu => [...prevMenu, "Line-ups"])
            setUpComingMenu(prevMenu => [...prevMenu, "Line-ups"])
        }else{
            setPastOrLiveMenu(prevMenu => prevMenu.filter(item => item !== "Line-ups"))
            setUpComingMenu(prevMenu => prevMenu.filter(item => item !== "Line-ups"))
        }
        if(features.matchH2h.normal===true){
            setPastOrLiveMenu(prevMenu => [...prevMenu, "H2H"])
            setUpComingMenu(prevMenu => [...prevMenu, "H2H"])
        }else{
            setPastOrLiveMenu(prevMenu => prevMenu.filter(item => item !== "H2H"))
            setUpComingMenu(prevMenu => prevMenu.filter(item => item !== "H2H"))
        }
    }
  },[features,userData])     

  const setActiveButton = (e) => {
    const buttons = document.querySelectorAll(".upcoming-menu");
    buttons.forEach((button) => {
      if (button.classList.contains("active")) {
        button.classList.remove("active");
        setInfo(true);
      }
    });
    e.target.classList.add("active");
    const pastbuttons = document.querySelectorAll(".pastorlive-menu");
    pastbuttons.forEach((button) => {
      if (button.classList.contains("active")) {
        button.classList.remove("active");
        setSummary(true);
      }
    });
    e.target.classList.add("active");
  };

  const setActiveInitial = () => {
    const buttons = document.querySelectorAll(".upcoming-menu");
    const pastButtons = document.querySelectorAll(".pastorlive-menu");
    buttons.forEach((button) => {
      if (button.innerHTML === "Info") {
        button.classList.add("active");
        setInfo(true);
      }
    });
    pastButtons.forEach((button) => {
      if (button.innerHTML === "Summary") {
        button.classList.add("active");
        setSummary(true);
      }
    });
  };

  useEffect(() => {
    if (!loading) {
      setActiveInitial();
    }
  }, [loading]);

  useEffect(() => {  
    fetchMatchDetails();

    //set interval for polling every 30 seconds
    const interval = setInterval(() => {
      fetchMatchDetails();
    }, 30000);

    // clear interval on unmount
    return () => clearInterval(interval);
  }, []);

  const fetchMatchDetails = () => {
    axios
      .get(`/match-details`, {
        params: {
          url: matchUrl,
        },
      })
      .then((res) => {
        setDetails(res.data.event);
        setLoading(false);
      })
      .catch(error => {
        toast(error.message)
      })   
  };

  const getInfo = () => {
    const infoUrl = matchUrl.slice(0, -6) + "/info.json?";
    axios
      .get(`/match-info`, {
        params: {
          url: infoUrl,
        },
      })
      .then((res) => {
        setInfoData(res.data);
      })
      .catch((error) => {
        toast(error.message);
      });
  };

  useEffect(() => {
    if (info) {
      getInfo();
    }
  }, [info]);

  const getStats = () => {
    const statsUrl = matchUrl.slice(0, -6) + "/stats.json?";
    axios
      .get(`/match-stats`, {
        params: {
          url: statsUrl,
        },
      })
      .then((res) => {
        setStatsData(res.data);
      })
      .catch((error) => {
        toast(error);
      });
  };

  useEffect(() => {
    if (stats) {
      getStats();
    }
  }, [stats]);

  const getLineUps= async ()=>{
    try {
        const lineUpsUrl = matchUrl.slice(0, -6) + "/lineups.json?"
        const result = await axios.get(`/line-ups`,{
            params:{url:lineUpsUrl}
        })
        result.data.pageProps.initialEventData && setLineUpsData(result.data.pageProps.initialEventData.event)
    } catch (error) {
        toast(error.message)
    }
  }

  useEffect(()=>{
    if(lineUps){
        getLineUps()
    }
  },[lineUps])

  const getH2h= async ()=>{
    try {
        const h2hUrl = matchUrl.slice(0, -6) + "/h2h.json?"
        const result = await axios.get(`/h2h`,{
            params:{url:h2hUrl}
        })
        result.data.pageProps.initialEventData && setH2hData(result.data.pageProps.initialEventData.event.headToHead)
    } catch (error) {
        toast(error.message)
    }
  }

  useEffect(()=>{
    if(h2h){
        getH2h()
    }
  },[h2h])

  return (
    <>
    <div className="match-details-section">
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <div style={{ display: "flex" }}>
            <div style={{ width: "50px" }}>
              <img
                src={`https://static.livescore.com/i2/fh/${details.flagUrl}.jpg`}
                style={{
                  minHeight: "30px",
                  minWidth: "30px",
                  maxHeight: "40px",
                  maxWidth: "40px",
                  borderRadius: "2px",
                }}         
                alt=""
              />
            </div>
            <div style={{ display: "grid" }}>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: 0,
                }}
              >
                {details.stageName}
              </p>
              <p>{details.categoryName}</p>
            </div>
          </div>
          <div
            style={{
              width: "100%",
              background: "#292c2f",
              borderRadius: "5px",
              display: "flex",
              padding: "20px",
            }}
          >
            <div style={{ width: "14.28%", height: "100%" }}>
              <span
                style={{
                  background: "#a39c9c",
                  fontSize: "12px",
                  color: "black",
                }}
              >
                {details.aggregateWinner === "HOME" && "Agg✓"}
              </span>
            </div>
            <div
              style={{
                width: "14.28%",
                display: "grid",
                justifyContent: "center",
              }}
            >
              <img
                src={
                  details.homeTeamBadge
                    ? details.homeTeamBadge.high
                    : require("../../assets/images/pngwing.com.png")
                }
                style={{ margin: "auto" }}
                alt=""
              />
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  marginTop: "10px",
                  marginBottom: 0,
                  textAlign: "center",
                }}
              >
                {details.homeTeamName}
              </p>
            </div>
            <div style={{ width: "14.28%", height: "100%" }}></div>
            <div
              style={{
                width: "14.28%",
                display: "grid",
                justifyContent: "center",
              }}
            >
              {details.eventStatus === "PAST" ? (
                <>
                  <h1>
                    {details.scores.homeTeamScore}-
                    {details.scores.awayTeamScore}
                  </h1>
                  <p
                    style={{
                      fontSize: "12px",
                      textAlign: "center",
                      marginBottom: 0,
                    }}
                  >
                    {details.scores.aggregateHomeScore &&
                      "Agg:" +
                        details.scores.aggregateHomeScore +
                        "-" +
                        details.scores.aggregateAwayScore}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      textAlign: "center",
                      marginBottom: 0,
                    }}
                  >
                    Full Time
                  </p>
                </>
              ) : details.eventStatus === "LIVE" ? (
                <>
                  <h1>
                    {details.scores.homeTeamScore}-
                    {details.scores.awayTeamScore}
                  </h1>
                  <p
                    style={{
                      fontSize: "12px",
                      textAlign: "center",
                      marginBottom: 0,
                    }}
                  >
                    {details.aggregateWinner &&
                      "Agg:" +
                        details.scores.aggregateHomeScore +
                        "-" +
                        details.scores.aggregateAwayScore}
                  </p>
                  <span
                    style={{
                      color: "red",
                      textAlign: "center",
                      marginBottom: 0,
                    }}
                  >
                    {details.status.slice(0, details.status.length - 1)}
                    <span className="blink">
                      {details.status.charAt(details.status.length - 1)}
                    </span>
                  </span>
                </>
              ) : details.eventStatus === "UPCOMING" ? (
                <>
                  <h1>{convertToIST(details.startDateTimeString)}</h1>
                  <p
                    style={{
                      fontSize: "12px",
                      textAlign: "center",
                      marginBottom: 0,
                    }}
                  >
                    {details.scores.aggregateHomeScore &&
                      "Agg:" +
                        details.scores.aggregateHomeScore +
                        "-" +
                        details.scores.aggregateAwayScore}
                  </p>
                  <span
                    style={{
                      fontSize: "12px",
                      textAlign: "center",
                      marginBottom: 0,
                    }}
                  >
                    {convertToDate(details.startDateTimeString)}
                  </span>
                </>
              ) : (
                <></>
              )}
            </div>
            <div style={{ width: "14.28%", height: "100%" }}></div>
            <div
              style={{
                width: "14.28%",
                display: "grid",
                justifyContent: "center",
              }}
            >
              <img
                src={
                  details.awayTeamBadge
                    ? details.awayTeamBadge.high
                    : require("../../assets/images/pngwing.com.png")
                }
                style={{ margin: "auto" }}
                alt=""
              />
              <p
                style={{
                  fontSize: "10px",
                  textAlign: "center",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  marginTop: "10px",
                  marginBottom: 0,
                }}
              >
                {details.awayTeamName}
              </p>
            </div>
            <div
              style={{
                width: "14.28%",
                height: "100%",
                display: "flex",
                alignItems: "end",
              }}
            >
              <span
                style={{
                  background: "#a39c9c",
                  fontSize: "12px",
                  color: "black",
                  marginLeft: "auto",
                }}
              >
                {details.aggregateWinner === "AWAY" && "✓Agg"}
              </span>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            {details.eventStatus === "UPCOMING" ? (
              <>
                {upComingMenu.map((menu, i) => (
                  <span
                    className="upcoming-menu"
                    key={i}
                    style={{
                      marginTop: "20px",
                      marginLeft: "20px",
                      fontWeight: "bold",
                    }}
                    onClick={(e) => {
                      setActiveButton(e);
                      switch (menu) {
                        case "Info":
                          setInfo(true);
                          setSummary(false);
                          setLineUps(false);
                          setH2h(false)
                          break;
                        case "Summary":
                          setSummary(true);
                          setInfo(false);
                          setLineUps(false);
                          setH2h(false)
                          break;
                        case "Line-ups":
                          setLineUps(true);
                          setInfo(false);
                          setSummary(false)
                          setH2h(false)
                          break;  
                        case "H2H":
                          setH2h(true)
                          setLineUps(false);
                          setInfo(false);
                          setSummary(false)
                          break;  
                        default:
                          break;
                      }
                    }}
                  >
                    {menu}
                  </span>
                ))}
              </>
            ) : (
              <>
                {userData && (
                  <span
                    className="pastorlive-menu"
                    style={{
                      marginTop: "20px",
                      marginLeft: "20px",
                      fontWeight: "bold",
                    }}
                    onClick={(e) => {
                      setActiveButton(e);
                      setLiveChat(true);
                      setInfo(false);
                      setSummary(false);
                      setStats(false);
                      setLineUps(false)
                    }}
                  >
                    Live Chat
                  </span>
                )}
                {pastOrLiveMenu.map((menu, i) => (
                  <span
                    className="pastorlive-menu"
                    key={i}
                    style={{
                      marginTop: "20px",
                      marginLeft: "20px",
                      fontWeight: "bold",
                    }}
                    onClick={(e) => {
                      setActiveButton(e);
                      switch (menu) {
                        case "Info":
                          setInfo(true);
                          setSummary(false);
                          setStats(false);
                          setLiveChat(false);
                          setLineUps(false)
                          setH2h(false)
                          break;
                        case "Summary":
                          setSummary(true);
                          setInfo(false);
                          setStats(false);
                          setLiveChat(false);
                          setLineUps(false)
                          setH2h(false)
                          break;
                        case "Stats":
                          setStats(true);
                          setInfo(false);
                          setSummary(false);
                          setLiveChat(false);
                          setLineUps(false)
                          setH2h(false)
                          break;
                        case "Line-ups":
                          setLineUps(true)
                          setStats(false);
                          setInfo(false);
                          setSummary(false);
                          setLiveChat(false);
                          setH2h(false)
                          break;  
                        case "H2H":
                          setH2h(true)
                          setLineUps(false);
                          setInfo(false);
                          setSummary(false)
                          setLiveChat(false);
                          setStats(false)
                          break;   
                        default:
                          break;
                      }
                    }}
                  >
                    {menu}
                  </span>
                ))}
              </>
            )}
          </div>
          <hr />
          {summary ? (
            <>
              {details.eventStatus === "UPCOMING" ? (
                <div
                  style={{
                    display: "grid",
                    justifyContent: "center",
                    borderRadius: "5px",
                    border: "1px solid #292c2f",
                    marginTop: "15px",
                    paddingBottom: "10px",
                    paddingTop: "10px",
                  }}
                >
                  Key match events will display here as they happen
                </div>
              ) : (
                <MatchSummary details={details} />
              )}
            </>
          ) : info ? (
            <>
              {infoData.length === 0 ? (
                <MatchInfo infoData={details} />
              ) : (
                <MatchInfo infoData={infoData} />
              )}
            </>
          ) : stats && pastOrLiveMenu.includes("Stats")? (
            <>
              {statsData.length !== 0 && (
                <MatchStats statsData={statsData} details={details} />
              )}
            </>   
          ) : userData && liveChat ? (
            <LiveChat
              chatroomId={details.id}
              eventStatus={details.eventStatus}
            />
          ) : lineUps && (upComingMenu.includes("Line-ups") || pastOrLiveMenu.includes("Line-ups"))?(
            <>
            {(lineUpsData.length!==0 && lineUpsData.lineups.homeStarters.length && lineUpsData.lineups.homeSubs.length)? <LineUps lineUpsData={lineUpsData}/>
            :<div style={{border:'1px solid #292c2f',borderRadius:'5px',display:'flex',justifyContent:'center',padding:'10px'}}>Line ups not available</div>}
            </>
          ): h2h && (upComingMenu.includes("H2H") || pastOrLiveMenu.includes("H2H"))?(
            <>
            {h2hData.length!==0?<H2h h2hData={h2hData}/>
            :<div style={{border:'1px solid #292c2f',borderRadius:'5px',display:'flex',justifyContent:'center',padding:'10px'}}>No data available</div>}
            </>
          ):(
            details.eventStatus === "UPCOMING"?(
                setInfo(true),
                setActiveInitial()
            ):(
                setSummary(true),
                setActiveInitial()
            )
          )}
        </>
      )}
    </div>
    <ToastContainer/>
    </>
  );
}

export default MatchDetails;
