import axios from 'axios';
import store from '../Redux/store';

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}/admin`,
  headers: {
    'Content-Type': 'application/json',
    withCredentials: true,
  },
});

//Add a request interceptor
instance.interceptors.request.use(
  (config)=>{
    const accessToken=store.getState().access_token.value
    if(accessToken){
      // const config = {
        config.headers= {
          Authorization: `Bearer ${accessToken.serial}`,
          'X-User-Data': JSON.stringify(accessToken.user) // Custom header with user data as a stringified JSON
        }
      // };
    }
    return config;
  },
  (error)=>{
    return Promise.reject(console.log(error))
  }
)
                
export default instance;