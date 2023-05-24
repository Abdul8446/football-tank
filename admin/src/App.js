import { BrowserRouter, Routes, Route , useNavigate} from "react-router-dom";
import './App.css';
import AdminHomepage from "./pages/AdminHomepage";
import Users from "./pages/Users";
import Notifications from "./pages/Notifications";
import ContentManagement from "./pages/ContentManagement";
import Plans from "./pages/Plans";
import { useEffect } from "react";
import AdminLogin from "./pages/admin-login/AdminLogin";
import { useSelector } from "react-redux";
import axios from 'axios'
import io from 'socket.io-client';



function App() {
  const socket = io(process.env.REACT_APP_SERVER_URL);

  useEffect(() => {
    // // Emit events and data to the server
    // socket.emit('adminEvent', { message: 'Hello user!' });
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<AdminHomepage/>} exact path="/admin" />
          <Route element={<AdminLogin/>} exact path="/admin/login"/>
          <Route element={<Users/>} exact path="/admin/users"/>
          <Route element={<Notifications/>} exact path="/admin/notifications"/>
          <Route element={<ContentManagement/>} exact path="/admin/manage-contents"/>
          <Route element={<Plans/>} exact path="/admin/plans"/>
        </Routes>
      </BrowserRouter>
      
    </div>
  )
}

export default App;
   