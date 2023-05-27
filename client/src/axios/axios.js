import axios from 'axios';

const instance = axios.create({
  baseURL: 'football-tank.site/api',
  headers: {
    'Content-Type': 'application/json',
    withCredentials: true,
  },
});

export default instance;