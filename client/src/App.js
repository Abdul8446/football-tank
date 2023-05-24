import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage/Homepage";
import React, { useEffect, useState } from "react";
import { FeaturesContext, UserContext ,cookieContext} from "./contexts/userContext";
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios'
import {useCookies} from "react-cookie"
import {ToastContainer,toast} from 'react-toastify'
import MatchDetailsPage from "./pages/matchdetailspage/MatchDetailsPage";
import CompetitionOverviewPage from "./pages/competition-overview/CompetitionOverviewPage";
import NewsPage from "./pages/newspage/NewsPage";
import NewsDetailPage from "./pages/news-detail-page/NewsDetailPage";
import TeamOverviewPage from "./pages/team-overview-page/TeamOverviewPage";
import FavoritesPage from "./pages/favorites-page/FavoritesPage";
import { Backdrop, Fade, IconButton, Paper, Popper } from "@mui/material";
import AdContents from "./components/ad-contents/AdContents";
import Layout from "./pages/layout/Layout";
import { Close } from "@mui/icons-material";
import io from 'socket.io-client'
import Cookie from 'js-cookie'    


// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   componentDidCatch(error, errorInfo) {
//     // Handle the error here, e.g., log the error or display an error message
//     console.error(error);
//     this.setState({ hasError: true });
//   }

//   render() {
//     if (this.state.hasError) {
//       // Render fallback UI when an error occurs
//       return <div>Something went wrong.</div>;
//     }

//     // Render the child components wrapped by the error boundary
//     return this.props.children;
//   }
// }
   
function App() {   
  const socket=io(process.env.REACT_APP_SERVER_URL)
  const [userData, setUserData] = useState(null)
  const [user, setUser] = useState()
  const [cookies,setCookie,removeCookie] = useCookies(['jwt']) 
  const [profilePic,setProfilePic] = useState(null)
  const [adLoading, setAdLoading] = useState(false)
  const [loadingPremiumActivation, setLoadingPremiumActivation] = useState(false)
  const [features,setFeatures] = useState(null)
  const [matches, setMatches] = useState([]);
  const [featuredNews,setFeaturedNews]=useState([])
  const [competitions, setCompetitions] = useState([])

  const handleLoginSuccess=(userData)=>{
    setUserData(userData)
    setUser(true)
    toast("hi "+userData.name,{theme:"dark"})
  }  
  
  const getImageUrl= async (userId)=>{
    const result = await axios.get(`${process.env.REACT_APP_SERVER_URL}/get-image-url`,{
        params:{userId:userId}    
    })
    if(result.data.imageNotFound){
      setProfilePic(null)
    }else{
        setProfilePic(result.data.imageName) 
    }
  }

  useEffect(() => {
    socket.on('userBlocked', (data) => {
      if(data.status===false){
        Cookie.remove("jwt")
        setUser(false)
        setUserData(null)
        toast.error('You have been blocked by the Admin')
      }
    });

    axios.get(`${process.env.REACT_APP_SERVER_URL}`,{withCredentials:true}).then((res) => {
      if(cookies.jwt){
        if(res.status===200){
          setFeatures(res.data.features[0])
          setUserData(res.data.user)
          getImageUrl(res.data.user._id)
        }
      }else{
        setUser(false)
        setFeatures(res.data.features[0])
      }
    });
  }, []);
  
  useEffect(()=>{
    let intervalId
    let timeoutId
    if(userData!==null  && userData?.premiumSubscription?.activated===true){
      if(features.ads.premium===true){
        timeoutId=setTimeout(()=>{
          setAdLoading(true)
        },5000)
        intervalId=setInterval(()=>{
          if(!adLoading){
            setAdLoading(true)
          }
        },10000)  
      }
    }
    if(user===false){
      timeoutId=setTimeout(()=>{
        setAdLoading(true)
      },5000)
      intervalId=setInterval(()=>{
        if(!adLoading){
          setAdLoading(true)
        }
      },10000)
    }
    return () => {
      clearInterval(intervalId)
      clearTimeout(timeoutId)
    };
  },[features,userData])     

  useEffect(()=>{
    if(userData){
      getImageUrl(userData._id)
      const urlParams = new URLSearchParams(window.location.search);
      const paramValue = urlParams.get('redirect_status');
      if (paramValue === 'succeeded') {
        setLoadingPremiumActivation(true)
        const urlWithoutQueryParams = window.location.origin + window.location.pathname;
        window.history.replaceState(null, '', urlWithoutQueryParams);
        activateSubscription()
        // Do something
      }
    }
  },[userData])

  const activateSubscription = async ()=>{
    try {
      const result = await axios.put(`${process.env.REACT_APP_SERVER_URL}/activate-premium-subscription`,{userId:userData._id})
      setUserData(result.data)
      setLoadingPremiumActivation(false)
      toast.success('Premium Activated')
    } catch (error) {
      toast(error.message)
    }
  }

  const popperStyles=[
    {position:'fixed',top:'10px !important',right:'10px !important',left:'unset !important'},
    {position:'fixed',top:'10px !important',left:'10px !important'},
    {position:'fixed',bottom:'10px !important',right:'10px !important',left:'unset !important',top:'unset !important'},
    {position:'fixed',bottom:'10px !important',left:'10px !important',top:'unset !important'},
    {position:'fixed',left:'35vw !important',top:'20vh !important'}
  ]

  return (
    <>
    <div className="root">     
      <FeaturesContext.Provider value={{features,setFeatures,matches,setMatches,featuredNews,setFeaturedNews,competitions,setCompetitions}}>
      <cookieContext.Provider value={{cookies,setCookie,removeCookie}}>
      <UserContext.Provider value={{
        userData:userData,                 
        setUserData:setUserData,
        onLoginSuccess:handleLoginSuccess,
        profilePic:profilePic,
        setProfilePic:setProfilePic,
        user:user,
        setUser:setUser
        }}>
        <BrowserRouter>
          <Routes>    
            <Route element={<Layout/>}>
              <Route element={<Homepage/>} exact path="/" />
              <Route element={<MatchDetailsPage/>} exact path="/match-details" />
              <Route element={<CompetitionOverviewPage/>} exact path="/competition-overview/:competition"/>
              <Route element={<NewsPage/>} exact path="/news"/>
              <Route element={<NewsDetailPage/>} exact path="/news/:id"/>
              <Route element={<TeamOverviewPage/>} exact path="/team-overview/:team"/>
              <Route element={<FavoritesPage/>} exact path="/favorites"/>
            </Route>              
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
      </cookieContext.Provider>
      </FeaturesContext.Provider>
    </div>     
    <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingPremiumActivation}
      >
        <div style={{display:'grid'}}>
          <div className="loader">
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
            <div className="bar4"></div>
            <div className="bar5"></div>
            <div className="bar6"></div>
            <div className="bar7"></div>
            <div className="bar8"></div>
            <div className="bar9"></div>
            <div className="bar10"></div>
            <div className="bar11"></div>
            <div className="bar12"></div>
          </div>
          <div>Activating Subscription</div>
        </div>
    </Backdrop>
    {adLoading?
    <>
    <Popper open={adLoading} sx={popperStyles[Math.floor(Math.random() * popperStyles.length)]} transition>
        {({ TransitionProps }) => (
          <>
          <Fade {...TransitionProps} 
          timeout={350}
          >
            <Paper>
              <AdContents/>
              <IconButton sx={{position:'absolute !important',right:'0 !important',color:'darkgrey'}} onClick={()=>{
                setAdLoading(false)
              }}>
                    <Close/>
              </IconButton>    
            </Paper>
          </Fade>
          </>
        )}
    </Popper>
    </>
    :''}
     <ToastContainer/>
    </>
  );
}

export default App;
   