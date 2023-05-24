import React, { useContext, useState } from 'react'
import './login-signup.css'
import axios from 'axios'
import {ToastContainer,toast} from 'react-toastify'
import {useCookies} from "react-cookie"
import { UserContext } from '../../contexts/userContext'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import {Visibility, VisibilityOff} from '@mui/icons-material';


function LoginSignup(props) {
    const [login,setLogin]=useState(true)
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [cookies,setCookie,removeCookie] = useCookies([]) 
    const {onLoginSuccess} = useContext(UserContext)
   

    // const [message,setMessage] = useState('')
    const [formData,setFormData] = useState({
        name:'',
        email:'',
        password:''
    })

    const handleInputChange = (e)=>{
        const {name,value}=e.target
        if(name==="login"){
            if(value.includes("@")){
                setFormData({
                    ...formData,
                    name:'',
                    email:value
                })
            }else{
                setFormData({
                    ...formData,
                    name:value, 
                    email:''
                })
            }       
        }else{
            setFormData({
                ...formData,
                [name]:value
            })
        }
    }

    const handleCheckboxChange = () => {
        setShowPassword(!showPassword);
    };

    const generateError=(err)=>{
        toast.error(err,{
            position:"bottom-right"
        })
    }

    const handleSubmit=async (e)=>{
        e.preventDefault()
        try {
                const loginOrSignup=login?'login':'signup'
                const url=`${process.env.REACT_APP_SERVER_URL}/${loginOrSignup}`
                const {data} = await axios.post(url,{...formData},{withCredentials:true})
                if(data){
                    if(data.errors){
                        const {name,email,password}=data.errors
                        if(name) generateError(name)
                        else if(email) generateError(email)
                        else if(password) generateError(password)
                    }else{
                        if(!login){
                            setLogin(true)
                            toast.success("Signup successfull!",{
                                    position:"top-right"
                            })
                        }else{
                            onLoginSuccess(data)
                            props.handleClose()
                        }
                    }
                }
        } catch (error) {
            console.log(error);
        } 
    }

  return (
    <>
    <form className='login-signup-modal-content' onSubmit={handleSubmit}>
      {login?(
          <>
        <TextField className='input-login-signup' type="text" label="Username or Email" variant="outlined" name='login' onChange={handleInputChange} value={formData.login}/>
        <TextField className='input-login-signup' type="password" label='Password' variant="outlined" name='password' value={formData.password} onChange={handleInputChange}/>
        <button type='submit' className='login-signup-button'>Log In</button>
        <p style={{marginLeft:"115px",marginTop:"60px"}}>Don't have an account? <span style={{color:"#0066CC"}} onClick={()=>{
            setLogin(false)
        }}>Sign Up</span></p>
        </>
      ):(
          <>
        <TextField className='input-login-signup' type="text" label="Username" variant="outlined" name='name' onChange={handleInputChange}/>
        <TextField className='input-login-signup' type="email" label="Email" variant="outlined" name='email' onChange={handleInputChange}/>
        <TextField className='input-login-signup'  type={showPassword ? 'text' : 'password'} label="Password" variant="outlined" name="password" 
        onChange={handleInputChange} placeholder='Password' InputProps={{
            endAdornment: (
                <InputAdornment position="end">
                    <IconButton onClick={handleCheckboxChange}>{showPassword?<VisibilityOff sx={{color:'grey'}}/>:<Visibility sx={{color:'grey'}}/>}</IconButton>
                </InputAdornment>
            ),
        }}/>
        <button type='submit' className='login-signup-button'>Sign Up</button>
        <p style={{marginLeft:"115px",marginTop:"60px"}}>Already have an account? <span style={{color:"#0066CC"}} onClick={()=>{
            setLogin(true)
        }}>Log In</span></p>
        </>
      )}  
    </form>
    <ToastContainer/>
    </>

  )
}

export default LoginSignup
