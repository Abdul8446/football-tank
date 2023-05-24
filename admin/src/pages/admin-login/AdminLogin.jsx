import React, { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Form from './Form';
import axios from '../../axios/axios'

function AdminLogin() {
  const navigate = useNavigate()
  useEffect(()=>{
    axios.get('/login').then(res=>{
      if(res.data){
        if(res.data.error){
          console.log(res.data.error)
        }else{       
          navigate('/admin')
        }
      }
    })
  },[])
  return (
    <Grid
      style={{ minHeight: '100vh' }}
      container
      sx={{
        p: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        direction: 'column',
      }}
    >
      <Paper elevation={20} container sx={{ padding: 10 }}>
        <Grid
          item
          display="flex"
          justifyContent="center"
        >
          {/* <img src={cambie} alt="" /> */}
        </Grid>
        <Grid
          item
          textAlign="center"
          paddingTop={5}
        >
          <Typography variant="h5" color="initial">Admin Login</Typography>
          <Form />
        </Grid>
      </Paper>
    </Grid>
  );
}

export default AdminLogin;