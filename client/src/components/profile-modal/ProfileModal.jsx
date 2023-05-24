import React, { useContext, useEffect, useState } from 'react'
import { Avatar, Box, Button, CircularProgress, IconButton, InputAdornment, SpeedDial, SpeedDialAction, SpeedDialIcon, Tab, TextField, Tooltip } from '@mui/material'
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab'
import { UserContext } from '../../contexts/userContext';
import { CameraAlt, Close, Delete,Edit, Done, ModeEdit} from '@mui/icons-material';
import './profile-modal.css'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';

function ProfileModal() {
    const [value, setValue] = React.useState('1');
    const {userData,setUserData,profilePic,setProfilePic} = useContext(UserContext)
    const [passwordChangeInputs, setPasswordChangeInputs] = useState(false)
    const [profileLoading,setProfileLoading] = useState(false)
    const [name, setName] = useState('')
    const [email,setEmail] = useState('')
    const [passwordEdit, setPasswordEdit] = useState(false)
    const [oldPassword, setOldPassword] = useState()
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [changePasswordLoading, setChangePasswordLoading] = useState(false)
    const [oldPasswordError, setOldPasswordError] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [newPasswordError, setNewPasswordError] = useState(null)
    const [confirmPasswordError, setConfirmPasswordError] = useState(null)
    const [nameEdit, setNameEdit] = useState(false)
    const [nameError, setNameError] = useState(null)
    const [nameEditLoading, setNameEditLoading] = useState(false)
    const [emailEdit, setEmailEdit] = useState(false)
    const [emailError, setEmailError] = useState(null)
    const [emailEditLoading, setEmailEditLoading] = useState(false)
    const [phone, setPhone] = useState()
    const [phoneEdit, setPhoneEdit] = useState(false)
    const [phoneError, setPhoneError] = useState(null)
    const [phoneEditLoading, setPhoneEditLoading] = useState(false)
    const profileBackground1=require('../../assets/images/stadium-background.jpg')

    useEffect(()=>{
        if(userData){    
            setName(userData.name)
            setEmail(userData.email)
            setPhone(userData.phone)                                
        }
    },[])

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhoneNumber(phoneNumber) {
        const regex = /^[6-9]\d{9}$/; 
        return regex.test(phoneNumber);
      }

    const updateProfile = async (data)=>{
        if(data.password){
            if(newPassword===''){
                setNewPasswordError('password cannot be empty')
                setChangePasswordLoading(false)
            }else if(newPassword.includes(' ')){
                setNewPasswordError('password cannot contain spaces')
                setChangePasswordLoading(false)
            }else if(newPassword.length<4){    
                setNewPasswordError('Password must be atleast 4 characters')
                setChangePasswordLoading(false)
            }else if(newPassword!==confirmPassword){
                setConfirmPasswordError('password does not match')
                setChangePasswordLoading(false)
            }else{
                try {     
                    let result = await axios.put(`${process.env.REACT_APP_SERVER_URL}/update-profile`,{
                            newPassword:newPassword,
                            userId:userData._id})
                    if(result.data.passwordUpdated){
                        setPasswordChangeInputs(false);setPasswordEdit(false);setPasswordLoading(false)
                        setChangePasswordLoading(false);setOldPasswordError(false);setNewPasswordError(null)
                        setConfirmPasswordError(null);setNewPassword('');setConfirmPassword('')
                        toast.success("Password Changed Successfully!",{
                            position:"top-right"
                        })    
                    }
                } catch (error) {   
                    toast(error.message)
                }
            }
        }else if(data.name){
            setNameEditLoading(true)
            if(name.length<4){
                setNameEditLoading(false)
                setNameError('Name must be atleast 4 characters')
            }else if(name.charAt(0)===' '){
                setNameEditLoading(false)
                setNameError('Name must not start with a space')
            }else{
                try {     
                    let result = await axios.put(`${process.env.REACT_APP_SERVER_URL}/update-profile`,{
                            newName:name,
                            userId:userData._id})
                    if(result.data.nameUpdated){
                       setNameEditLoading(false);setNameError(null);setNameEdit(false)
                       setUserData(result.data.newUserData)
                        toast.success("Name Changed Successfully!",{
                            position:"top-right"
                        })    
                    }
                } catch (error) {   
                    toast(error.message)
                }
            }
        }else if(data.email){
            setEmailEditLoading(true)
            if(!validateEmail(email)){
                setEmailError('Invalid Email')
                setEmailEditLoading(false)
            }else{
                try {     
                    let result = await axios.put(`${process.env.REACT_APP_SERVER_URL}/update-profile`,{
                            newEmail:email,
                            userId:userData._id})
                    if(result.data.emailUpdated){
                       setEmailEditLoading(false);setEmailError(null);setEmailEdit(false)
                       setUserData(result.data.newUserData)
                        toast.success("Email Changed Successfully!",{
                            position:"top-right"
                        })    
                    }
                } catch (error) {   
                    toast(error.message)
                }
            }
        }else if(data.phone){
            if(!validatePhoneNumber(phone)){
                setPhoneError('Invalid Phone Number')
                setPhoneEditLoading(false)
            }else{
                try {     
                    let result = await axios.put(`${process.env.REACT_APP_SERVER_URL}/update-profile`,{
                            newPhone:phone,
                            userId:userData._id})
                    if(result.data.phoneUpdated){
                       setPhoneEditLoading(false);setPhoneError(null);setPhoneEdit(false)
                       setUserData(result.data.newUserData)
                        toast.success("Phone Number Changed Successfully!",{
                            position:"top-right"
                        })    
                    }
                } catch (error) {   
                    toast(error.message)
                }
            }
        }
    }

    const verifyOldPassword= async ()=>{
        setPasswordLoading(true)
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/verify-old-password`,{
            params:{
                userId:userData._id,
                password:oldPassword
            }
        })
        if(response.data.verified){
            setPasswordChangeInputs(true)
        }else{
            setOldPasswordError(true)
            setPasswordLoading(false)
        }
    }        
      
    const uploadPicture = async (pics)=>{
        setProfileLoading(true)
        if(!pics){
            setProfileLoading(false)
        }
        const data = new FormData()
            data.append('file',pics)
            data.append('userid',userData._id)
            const result = await axios.post(`${process.env.REACT_APP_SERVER_URL}/add-profile-picture`,data,{
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            })
            setProfilePic(result.data.imageName) 
            setProfileLoading(false)   
    }

    const changePicture=async (pics)=>{
        setProfileLoading(true)
        const data = new FormData()
            data.append('file',pics)
            data.append('userid',userData._id)
            const result = await axios.put(`${process.env.REACT_APP_SERVER_URL}/change-profile-picture`,data,{
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            })
            setProfilePic(result.data.imageName) 
            setProfileLoading(false)  
    }

    const deletePicture = async ()=>{
        setProfileLoading(true) 
        try {
            const {data}=await axios.delete(`${process.env.REACT_APP_SERVER_URL}/delete-profile-picture/${userData._id}`)
            setUserData(data)
            setProfilePic(null)
            setProfileLoading(false)
        } catch (error) {
            toast(error.message)
        }
    }

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  
    return (
      <> 
      <Box sx={{ width: '100%', typography: 'body1'}}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Account Details" value="1" />
              {/* <Tab label="Item Two" value="2" /> */}
              {/* <Tab label="Item Three" value="3" /> */}
            </TabList>
          </Box>
          <TabPanel value="1" 
            sx={{display:'flex',height:'450px',backgroundImage:`url(${profileBackground1})`,
                backgroundSize:'cover'
            }}            
          >
            <div style={{width:'27%',display:'flex'}}>    
                <Tooltip arrow title='upload profile picture' placement='bottom-end'>
                    <>
                    <Avatar
                        alt="Remy Sharp"
                        src={profilePic || require("../../assets/images/default-avatar.avif")}
                        sx={{ width: 150, height: 150 }}
                    />
                    {profileLoading && <CircularProgress className='profile-avatar' sx={{
                        position: 'absolute', 
                        width: '150px !important',
                        height:'150px !important',
                        borderRadius:'50%',
                        display: 'flex',        
                        alignItems: 'center',
                        justifyContent: 'center',                                                                   
                        backgroundColor: 'rgba(0, 0, 0, 0.5) !important',
                    }} />}      
                    </>
                </Tooltip>
                <Box sx={{ height: 200, transform: 'translateZ(0px)', flexGrow: 1 }}>        
                <SpeedDial
                    ariaLabel="SpeedDial basic example"
                    sx={{ position: 'absolute', bottom: 16, right: 16 }}
                    icon={<SpeedDialIcon />}
                >
                    {!profilePic?<SpeedDialAction
                        icon={<IconButton color="primary" aria-label="upload picture" component="label">
                        <CameraAlt/>
                        <input hidden accept="image/*" type="file" onChange={(e)=>uploadPicture(e.target.files[0])}/>
                        </IconButton>}
                        tooltipTitle='Add Photo'
                    />
                    :<SpeedDialAction
                        icon={<IconButton color="primary" aria-label="upload picture" component="label">
                        <CameraAlt/>
                        <input hidden accept="image/*" type="file" onChange={(e)=>changePicture(e.target.files[0])}/>
                        </IconButton>}
                        tooltipTitle='Change Photo'
                    />}     
                    {profilePic && <SpeedDialAction
                        icon={<Delete onClick={deletePicture}/>}
                        tooltipTitle='Delete'
                    />}
                </SpeedDial>
                </Box>
            </div>
            <div style={{width:'73%',display:'flex'}}>
                <div style={{width:'40%'}}>
                    <p style={{fontWeight:'bold',color:'white',marginTop:'18px'}}>NAME</p>
                    <p style={{fontWeight:'bold',color:'white',marginTop:'50px'}}>EMAIL</p>
                    <p style={{fontWeight:'bold',color:'white',marginTop:'50px'}}>PHONE</p>
                    <p style={{fontWeight:'bold',color:'white',marginTop:'50px'}}>PASSWORD</p>
                </div>   
                <div style={{width:'60%'}}>
                    <TextField style={{width:'100%'}} 
                    error={nameError!==null}                      
                    label={nameEdit?nameError!==null?'Error':'New Username':''}    
                    helperText={nameError!==null?nameError:''}
                    // variant="standard" 
                    InputProps={{
                        readOnly:nameEdit?false:true,
                        style:{color:'white'},
                        value:name,     
                        endAdornment: (
                            <InputAdornment>
                                {!nameEdit?<IconButton onClick={()=>setNameEdit(!nameEdit)}><Edit sx={{color:'white !important'}}/></IconButton>
                                :<><CircularProgress size={20} color='inherit' sx={{marginRight:'10px',display:!nameEditLoading?'none':''}}/>
                                <IconButton sx={{padding:'2px',display:nameEditLoading?'none':''}} onClick={()=>{
                                    updateProfile({name:true})
                                }}><Done color='primary'/></IconButton>
                                <IconButton sx={{padding:'2px',display:nameEditLoading?'none':''}} onClick={()=>{
                                    setNameEdit(false);setNameError(null)
                                }}><Close color='warning'/></IconButton></>}                     
                            </InputAdornment>
                        ),     
                    }}
                    onChange={(e)=>{
                    setName(e.target.value);setNameError(null)
                    }}/>
                    <TextField style={{width:'100%',marginTop:'20px'}} 
                    error={emailError!==null}                      
                    label={emailEdit?emailError!==null?'Error':'New Email':''}    
                    helperText={emailError!==null?emailError:''}
                    // variant="standard" 
                    InputProps={{
                        readOnly:emailEdit?false:true,
                        style:{color:'white'},
                        type:email,
                        value:email,      
                        endAdornment: (
                            <InputAdornment position="end">
                                {!emailEdit?<IconButton onClick={()=>setEmailEdit(!emailEdit)}><Edit sx={{color:'white !important'}}/></IconButton>
                                :<><CircularProgress size={20} color='inherit' sx={{marginRight:'10px',display:!emailEditLoading?'none':''}}/>
                                <IconButton sx={{padding:'2px',display:emailEditLoading?'none':''}} onClick={()=>{
                                    updateProfile({email:true})
                                }}><Done color='primary'/></IconButton>
                                <IconButton sx={{padding:'2px',display:emailEditLoading?'none':''}} onClick={()=>{
                                    setEmailEdit(false);setEmailError(null)
                                }}><Close color='warning'/></IconButton></>}                     
                            </InputAdornment>
                        ),     
                    }}
                    onChange={(e)=>{
                    setEmail(e.target.value);setEmailError(null)
                    }}/>
                    <TextField style={{width:'100%',marginTop:'20px'}} 
                    error={phoneError!==null}                      
                    label={emailEdit?phoneError!==null?'Error':'New Phone number':''}    
                    helperText={phoneError!==null?phoneError:''}
                    // variant="standard" 
                    InputProps={{
                        readOnly:phoneEdit?false:true,
                        style:{color:'white'},
                        value:phone,      
                        endAdornment: (
                            <InputAdornment position="end">
                                {!phoneEdit?<IconButton onClick={()=>setPhoneEdit(!phoneEdit)}><Edit sx={{color:'white !important'}}/></IconButton>
                                :<><CircularProgress size={20} color='inherit' sx={{marginRight:'10px',display:!phoneEditLoading?'none':''}}/>
                                <IconButton sx={{padding:'2px',display:phoneEditLoading?'none':''}} onClick={()=>{
                                    updateProfile({phone:true})
                                }}><Done color='primary'/></IconButton>
                                <IconButton sx={{padding:'2px',display:phoneEditLoading?'none':''}} onClick={()=>{
                                    setPhoneEdit(false);setPhoneError(null)
                                }}><Close color='warning'/></IconButton></>}                     
                            </InputAdornment>
                        ),     
                    }}
                    onChange={(e)=>{
                    setPhone(e.target.value);setPhoneError(null)
                    }}/>

                    {!passwordChangeInputs && <><TextField sx={{marginTop:'20px',width:'100%',display:passwordEdit?'none':''}} label="" 
                        // variant="standard" 
                        InputProps={{
                        style:{color:'white'},    
                        readOnly: true,
                        value:'********',
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={()=>setPasswordEdit(!passwordEdit)}><Edit sx={{color:'white !important'}}/></IconButton>
                            </InputAdornment>
                        ),       
                    }}/>
                    <TextField sx={{marginTop:'20px',width:'100%',display:!passwordEdit?'none':''}} 
                        label={oldPasswordError?'Error':"Old Password"} 
                        // variant="standard" 
                        error={oldPasswordError}
                        helperText={oldPasswordError?'Incorrect Password':''}
                        InputProps={{
                        style:{color:'white'},    
                        type:'password',
                        width:'100%',
                        endAdornment: (
                            <InputAdornment position="end">
                                {passwordLoading?<CircularProgress size={20} color='inherit' sx={{marginRight:'10px'}}/>
                                :<><IconButton sx={{padding:'2px'}} onClick={(e)=>verifyOldPassword(e.target)}><Done color='primary'/></IconButton>
                                <IconButton sx={{padding:'2px'}} onClick={()=>setPasswordEdit(!passwordEdit)}><Close color='warning'/></IconButton></>}
                            </InputAdornment>
                        ), 
                    }}
                    onChange={(e)=>{setOldPassword(e.target.value);setOldPasswordError(false)}}/></>}
                    
                    {passwordChangeInputs && <><TextField sx={{width:'100%',display:!passwordChangeInputs?'none':'',marginTop:'20px'}} 
                    label={newPasswordError!==null?'Error':"New Password" }
                    helperText={newPasswordError!==null?newPasswordError:''}
                    error={newPasswordError!==null}
                    // variant="standard" 
                    InputProps={{
                        style:{color:'white'},
                        type:'password',
                        value:newPassword                                               
                    }}   
                    onChange={(e)=>{
                        setNewPassword(e.target.value);setNewPasswordError(null)
                    }}/>
                    <TextField sx={{width:'100%',display:!passwordChangeInputs?'none':'',marginTop:'20px'}} 
                    label={confirmPasswordError!==null?'Error':"Confirm Password" }
                    helperText={confirmPasswordError!==null?confirmPasswordError:''}
                    error={confirmPasswordError!==null}   
                    // variant="standard" 
                    InputProps={{
                        style:{color:'white'},
                        type:'password',
                        value:confirmPassword   
                    }}
                    onChange={(e)=>{ 
                        setConfirmPassword(e.target.value);setConfirmPasswordError(null)
                    }}/>
                    <div style={{display:!passwordChangeInputs?'none':'flex',justifyContent:'end',marginTop:'5px'}}>
                        <Button sx={{marginRight:'5px'}} variant="contained" color='error' size="small"
                        onClick={()=>{
                            setPasswordChangeInputs(false);setPasswordEdit(false);setPasswordLoading(false)
                            setChangePasswordLoading(false);setOldPasswordError(false);setNewPasswordError(null);
                            setConfirmPasswordError(null);setNewPassword('');setConfirmPassword('')
                        }}    
                        >cancel</Button>                      
                        <LoadingButton variant="contained" loading={changePasswordLoading} size="small" onClick={()=>{
                            setChangePasswordLoading(true)
                            updateProfile({password:true})
                        }}>save</LoadingButton>
                    </div></>}    
                </div>            
            </div>     
          </TabPanel>
          {/* <TabPanel value="2">Item Two</TabPanel> */}
          {/* <TabPanel value="3">Item Three</TabPanel> */}
        </TabContext>
      </Box>
      <ToastContainer/>
      </>
    );
}

export default ProfileModal
