import React, { useContext, useEffect, useState, lazy} from "react";
import "./navbar.css";
import axios from "axios";
import { Box, Modal} from "@mui/material";
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import LoginSignup from "../login-signup/LoginSignup";
import { UserContext} from "../../contexts/userContext";
import {ToastContainer,toast} from 'react-toastify'
import {Article, Close, SportsSoccer, StarBorder} from '@mui/icons-material'
import { useNavigate } from "react-router-dom";
import ProfileModal from "../profile-modal/ProfileModal";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import timestamp from "../../scripts/defaultTimeStamp";
import Cookie from 'js-cookie'
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import { Avatar, Button } from "@chatscope/chat-ui-kit-react";   
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const CheckoutForm = lazy(() => import("../subscription/CheckoutForm"));
     
  
function Navbar({paymentUrl,setPaymentUrl}) {
  const navigate=useNavigate()
  const [navMatches, setNavMatches] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = useState(false)
  const [premiumMenuOpen,setPremiumMenuOpen] = useState(false)
  const [clientSecret, setClientSecret] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => {setOpen(false)};
  const handleProfileOpen = () => setProfileOpen(true);
  const handleProfileClose = () => {
    setProfileOpen(false)
  };
  const { userData,profilePic,setUserData,setUser } = useContext(UserContext);
  
  const subscribePremium = async ()=>{
    try {
      const result = await axios.post(`${process.env.REACT_APP_SERVER_URL}/create-payment-intent`,{userId:userData._id},{withCredentials:true})
      setClientSecret(result.data.clientSecret)
    } catch (error) {
      toast(error.message)
    }      
  }

  const appearance = {
    theme: 'night',
    labels: 'floating'
  };

  const options = {
    clientSecret,
    appearance,
  };

  const logout=()=>{
    // setCookie("jwt",'',{expires:new Date(0)})
    Cookie.remove("jwt")
    setUserData(null)
    setUser(false)
    toast("Logout Successfully",{theme:"dark"})
  }

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/navbar`,{params:{defaultTimeStamp:timestamp}}).then((res) => {
      setNavMatches(res.data.navMatches.Stages);
    });
  }, []);

  return (
    <>
    <div>
      <div className="top-section">
        <div className="top-events">TOP EVENTS</div>
        <div className="top-section">
          {navMatches.slice(0, 10).map((comp, i) => (
            <div key={i} style={{display:'flex'}}>
              <div className="competition-short-name">
                {comp.CompN}
              </div>
              {comp.Events.map((match, j) => (
                <>
                  {j > 0 ? (
                    <div
                      style={{
                        minWidth: "1px",
                        height: "100%",
                        background: "white",
                        color: "white",
                      }}
                    ></div>
                  ) : (
                    ""               
                  )}
                  <div className="matches">
                    <div>
                      {" "}
                      {match.Eps === "NS" ? (
                        match.Esd.toString().substring(8, 10) +
                        ":" +
                        match.Esd.toString().substring(10, 12)
                      ) : match.Eps !== "FT" &&
                        match.Eps !== "Canc." &&
                        match.Eps !== "AP" &&
                        match.Eps !== "AET" &&
                        match.Eps !== "HT" ? (
                        <>
                          <span style={{ color: "red" }}>
                            {match.Eps.slice(0, -1)}
                          </span>
                          <span className="blink-top">
                            {match.Eps.charAt(match.Eps.length - 1)}
                          </span>
                        </>
                      ) : (
                        match.Eps
                      )}
                    </div>
                    <div style={{ display: "flex", marginTop: "5px" }}>
                      <img
                        height="16px"
                        width="16px"
                        src={
                          "https://lsm-static-prod.livescore.com/medium/" +
                          match.T1[0].Img
                        }
                        alt=""
                      />
                      <span style={{ marginLeft: "5px" }}>
                        {match.T1[0].Abr}
                      </span>
                      <span style={{ marginLeft: "50px" }}>{match.Tr1}</span>
                    </div>
                    <div style={{ display: "flex", marginTop: "5px" }}>
                      <img
                        height="16px"
                        width="16px"
                        src={
                          "https://lsm-static-prod.livescore.com/medium/" +
                          match.T2[0].Img
                        }
                        alt=""
                      />
                      <span style={{ marginLeft: "5px" }}>
                        {match.T2[0].Abr}
                      </span>
                      <span style={{ marginLeft: "50px" }}>{match.Tr2}</span>
                    </div>
                  </div>
                </>                         
              ))}
            </div>
          ))}
        </div>       
      </div>
      <div className="user-navigation-area">
        <span className="main-logo">FOOTBALL-TANK</span>
        <div className="navbar-links">
            <span style={{cursor:'pointer'}} onClick={()=>navigate('/')}><SportsSoccer/> Scores</span>
            <span style={{cursor:'pointer'}} onClick={()=>navMatches.length!==0?navigate('/favorites',{ state: { navMatches }}):toast('please wait...')}><StarBorder/> Favorites</span>
            <span style={{cursor:'pointer'}} onClick={()=>navigate('/news')}><Article/> News</span>       
        </div>
        <div className="right-navigation">
        <div className="dropdown">        
          <AccountCircleSharpIcon fontSize="large"/> 
          <div className="dropdown-content" onMouseLeave={()=>setPremiumMenuOpen(false)}> 
            {userData?(    
              <>  
                  <div style={{display:'flex',alignItems:'center'}}>
                  {/* <Tooltip arrow title='View Profile' placement='bottom-end'>
                  </Tooltip> */}                  
                    <div>
                    <Avatar src={profilePic || require("../../assets/images/default-avatar.avif")} size="md"/>
                    </div>
                    <span style={{marginLeft:'10px',color:'#6ea9d7',fontWeight:'bold'}}>{userData.name}</span>
                  </div>           
                  <hr style={{color:'#6ea9d7'}}/> 
                  <div style={{display:'flex',width:'100%'}}>
                    <div style={{minWidth:'112px'}}>
                      <Button onClick={handleProfileOpen}>Profile</Button>
                      <Button onClick={()=>setPremiumMenuOpen(true)}>Premium</Button>
                      <Button onClick={logout}>Logout</Button>
                    </div>
                    <div className='premium-menu' style={{display:premiumMenuOpen?'block':'none'}}>
                      <div style={{display:'flex',justifyContent:'space-between'}}>
                        <div className='premium-price' style={{borderColor:'orangered'}}>
                          <img src={require('../../assets/images/🦆 icon _crown_yellow.png')} alt="" />
                          <h3 style={{color:'white'}}>Premium</h3>
                          <h3 style={{color:'#FD4106',lineHeight:0.5}}>₹990</h3>
                          <div style={{color:'white',width:'100%',display:'flex',justifyContent:'space-between'}}>
                            <span style={{fontSize:'12px'}}>Per Month</span>
                            <input className="premium-checkbox" type="checkbox" checked disabled/>
                          </div>
                        </div>
                        <div className='premium-price'>
                          <img src={require('../../assets/images/🦆 icon _crown_purple.png')} alt="" />
                          <h3 style={{color:'white'}}>Premium Pro</h3>
                          <h3 style={{color:'#FD4106',lineHeight:0.5}}>₹1950</h3>
                          <div style={{color:'white',width:'100%',display:'flex',justifyContent:'space-between'}}>
                            <span style={{fontSize:'12px'}}>Per Month</span>
                            <input className="premium-checkbox" type="checkbox" disabled/>
                          </div>
                          <div className="not-available"><h3 style={{color:'rgb(153 23 20)'}}>Not Available</h3></div>
                        </div>
                      </div>
                      <h5 style={{color:'white',fontWeight:'bold',lineHeight:2}}>Premium Features</h5>
                      <table style={{height:'215px',width:'100%'}}>
                        <thead style={{background:'#1c1919',color:'white',textAlign:'center'}}>
                          <tr style={{borderBottom:'1px solid black'}}>
                            <th>Features</th>
                            <th style={{borderLeft:'1px solid black'}}>Non<br/>Premium</th>
                            <th style={{borderLeft:'1px solid black'}}>Premium</th>
                            <th style={{borderLeft:'1px solid black'}}>Premium<br/>Pro</th>
                          </tr>
                        </thead>
                        <tbody style={{background:'#212529'}}>
                          <tr style={{borderBottom:'1px solid black'}}>
                            <td style={{paddingLeft:'10px',color:'white'}}>Ad Free</td>
                            <td style={{borderLeft:'1px solid black'}}></td>
                            <td style={{borderLeft:'1px solid black',textAlign:'center'}}><img src={require('../../assets/images/✓.png')} alt="" /></td>
                            <td style={{borderLeft:'1px solid black',textAlign:'center'}}><img src={require('../../assets/images/✓.png')} alt="" /></td>
                          </tr>
                          <tr style={{borderBottom:'1px solid black'}}>
                            <td style={{paddingLeft:'10px',color:'white'}}>Detailed Stats</td>
                            <td style={{borderLeft:'1px solid black'}}></td>
                            <td style={{borderLeft:'1px solid black',textAlign:'center'}}><img src={require('../../assets/images/✓.png')} alt="" /></td>
                            <td style={{borderLeft:'1px solid black',textAlign:'center'}}><img src={require('../../assets/images/✓.png')} alt="" /></td>
                          </tr>
                          <tr>
                            <td style={{paddingLeft:'10px',color:'white'}}>Live Stream</td>
                            <td style={{borderLeft:'1px solid black'}}></td>
                            <td style={{borderLeft:'1px solid black'}}></td>
                            <td style={{borderLeft:'1px solid black',textAlign:'center'}}><img src={require('../../assets/images/✓.png')} alt="" /></td>
                          </tr>
                        </tbody>
                      </table>
                      <button className="subscribe-button" onClick={subscribePremium}>Subscribe</button>
                    </div>
                  </div>   
              </>
              ):(
                <>
                <Button onClick ={handleOpen}>Login</Button>
                </>
              )
            }
          </div>
        </div>      
         <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="login-signup-modal">
              <div className="modal-title-section">
                <h3 style={{ color: "white" }}>X</h3>
                <h1 className="modal-title">FOOTBALL-TANK</h1>
                <h3
                  onClick={handleClose}
                  style={{ marginLeft: "auto", color: "#A39E9E" }}
                >
                  <Close/>
                </h3>
              </div>
              <LoginSignup handleClose={handleClose}/>
            </Box>
          </Modal>
          <Modal
            open={profileOpen}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="profile-modal" sx={{background:'black'}}>
              <div className="modal-title-section">
                <h1 style={{color:'#1d213f',fontFamily:'SFSportsNight'}}>Profile</h1>
                <h3
                  onClick={handleProfileClose}
                  style={{ marginLeft: "auto", color: "#A39E9E" }}
                >
                  <Close/>
                </h3>
              </div>
              {/* <hr/> */}
              <ProfileModal handleClose={handleProfileClose}/>
            </Box>
          </Modal>
        </div>
      </div>    
      {clientSecret && (
        // <Modal open={true} className='payment-modal'>
          <Elements options={options} stripe={stripePromise}>
          {/* <Suspense fallback={<div>Loading...</div>}> */}
            <CheckoutForm />
          {/* </Suspense> */}
          </Elements>
        // </Modal>
      )}
    </div>
    <ToastContainer/>
    </>
  );
}

export default Navbar;   
