/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { Button, TextField, Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../../axios/axios';
import { change_token } from '../../Redux/accesstoken/access_token';

function Form() {
const dispatch = useDispatch()
const navigate = useNavigate();
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState({});

const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
        email,
        password,
    };
    axios.post('/login', data)
    .then((res) => {
        if(res.data){
            if(res.data.error){
                console.log(res.data.error)
            }else{
                dispatch(change_token({
                  access_token:{
                    serial:res.data.accessToken,
                    user:res.data.user
                }
                }))
                navigate('/admin');
            }
        }
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };


  return (
    <form onSubmit={handleSubmit}>
      <Grid container={true} direction="column" alignItems="center" justify="center" paddingTop={2}>
        <TextField variant="outlined" label="username" fullWidth style={{ marginBlock: '1rem' }} value={email} onChange={(e) => setEmail(e.target.value)} error={!!error.name} helperText={error.name ? error.msg : null} />
        <TextField variant="outlined" label="Password" fullWidth type="password" style={{ marginBlock: '1rem' }} value={password} onChange={(e) => setPassword(e.target.value)} error={!!error.password} helperText={error.password ? error.msg : null} />
        <Button size="large" variant="contained" color="primary" type="submit">Login</Button>
      </Grid>
    </form>
  );
}

export default Form;