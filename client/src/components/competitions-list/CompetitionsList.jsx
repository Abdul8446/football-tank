import React, { useContext, useEffect, useState } from "react";
import "./competitions-list.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FeaturesContext } from "../../contexts/userContext";

function CompetitionsList() {
  const navigate = useNavigate()
  const {competitions, setCompetitions} = useContext(FeaturesContext);
  const [isCompetition, setIsCompetition] = useState(true);
  const [subCompetitions, setSubCompetitions] = useState([]);
  const [competitionTitle, setCompetitionTitle] = useState('')
  const [fullList, setFullList] = useState(false);
  const [fullStages, setFullStages] = useState([])
  const [searchResults, setSearchResults] = useState([])

  const handleSearch =(value)=>{
    if(value!==''){
      setCompetitions([])
      const result = fullStages.filter(comp=>{
        return comp[1].toLowerCase().includes(value.toLowerCase())
      })
      setSearchResults(result)
    }else{  
      setSearchResults([])
      setCompetitions(prevValue=>[...prevValue,...fullStages.slice(0, 25)])
    }
  }

  const goToCompetitionOverview=(competition,compName)=>{
    const competitionUrl=`${process.env.REACT_APP_COMPETITION_URL}/${competition}/5.30?MD=1`
    try {
      axios.get(`${process.env.REACT_APP_SERVER_URL}/competition-overview`,{
          params:{url:competitionUrl}
      }).then(res=>{
          navigate(`/competition-overview/${compName}`,{state:{overview:res.data}})
      })
    } catch (error) {
      toast(error.message)
    }
  }

  const fetchData = () => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/competitions-list`).then((res) => {
      setFullStages(res.data)
      if (fullList) {
        setCompetitions(res.data);
      } else {
        setCompetitions(res.data.slice(0, 25));
      }
    }).catch(()=>{
      fetchData()
    })
  };

  const getSubCompetitions = (subCompetition) => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/sub-competitions`, {
        params: { subCompetition: subCompetition },
      })
      .then((res) => {
        setSubCompetitions(res.data);
        setIsCompetition(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [fullList]);

  return (
    <>
    <div className="competitions-section">
      {isCompetition ? (
        <>
          <div className="competitions-search">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="#292c2f"
              width="20px"
              height="20px"
              className="search-svg"
            >
              <path d="M10.5 4.5C6.4 4.5 3 7.9 3 12s3.4 7.5 7.5 7.5S18 16.1 18 12s-3.4-7.5-7.5-7.5zm0 12.5c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zM17.7 16.3l-3.7-3.7c-.2-.2-.5-.2-.7 0l-.8.8c-.2.2-.2.5 0 .7l3.7 3.7c.2.2.5.2.7 0l.8-.8c.2-.2.2-.5 0-.7z" />
            </svg>

            <input
              className="search-input"
              type="text"
              placeholder="Search..."
              onChange={(e)=>{
                handleSearch(e.target.value)
              }}
            />
          </div>
        </>
      ) : (
        <>
        <div style={{display:'flex'}}>
          <h1 onClick={() => setIsCompetition(true)}>&lt;</h1>
          <span style={{margin:'auto'}}>{competitionTitle}</span>
        </div>                                 
        </>
      )}
      <hr />
      {isCompetition ? (
        <>
          {competitions.length!==0?competitions.map((competition, i) => (
            <div
              className="list-container"
              key={i}
              onClick={() => {
                getSubCompetitions(competition[0]);
                setCompetitionTitle(competition[1])
              }}
            >
              <img
                className="list-logo"
                src={
                  "https://static.livescore.com/i2/fh/" +
                  competition[3] +
                  ".jpg"
                }
                alt=""
              />
              <span className="list-names">{competition[1]}</span>
            </div>
          )):''}
          {searchResults.length!==0?searchResults.map((competition, i) => (
            <div
              className="list-container"
              key={i}
              onClick={() => {
                getSubCompetitions(competition[0]);
                setCompetitionTitle(competition[1])
              }}
            >
              <img
                className="list-logo"
                src={
                  "https://static.livescore.com/i2/fh/" +
                  competition[3] +
                  ".jpg"
                }
                alt=""
              />
              <span className="list-names">{competition[1]}</span>
            </div>
          )):''}
        </>
      ) : (     
        <>
          {subCompetitions.map((competition, i) => (
            <div
              className="list-container" key={i} onClick={() => {
                goToCompetitionOverview(competition[2].substring(4,competition[2].length-1),competition[0])
              }}>
              <img className="list-logo" src={"https://static.livescore.com/i2/fh/" +competition[3] +".jpg"} alt=""/>
              <span className="list-names">{competition[1]}</span>
            </div>
          ))}
        </>
      )}
      {isCompetition && !fullList?(
        <>
        <hr/>
        <p style={{textAlign:"center",lineHeight:0}} onClick={()=>{
            setFullList(true)
        }}>View all</p>
        </>
        ):isCompetition && fullList?(
        <>
        <hr/>
        <p style={{textAlign:"center",lineHeight:0}} onClick={()=>{
            setFullList(false)
        }}>View less</p>
        </>
        ):''
      }
    </div>
    <ToastContainer/>
    </>
  );
}

export default CompetitionsList;    
