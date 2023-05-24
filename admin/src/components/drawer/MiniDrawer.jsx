import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar/Toolbar';
import List from '@mui/material/List/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography/Typography';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem/ListItem';
import ListItemButton from '@mui/material/ListItemButton/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon/ListItemIcon';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import StarsIcon from '@mui/icons-material/Stars';
import {useNavigate} from 'react-router-dom'
import './mini-drawer.css'
import UserTable from '../user-table/UserTable';
import { useContext } from 'react';







     
const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'padding',
})(({ theme, open ,padding }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  padding: padding || 0,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function MiniDrawer(props) {
  const navigate=useNavigate()
  const [open, setOpen] = React.useState(props.open!==undefined?props.open:true);            
                          
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{
        background:'#15283C'
      }}>
        <Toolbar disableGutters sx={{minHeight:'0 !important',height:'60px'}}>
          <div style={{background:'#FF5722',height:'100%'}}>   
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={!open?handleDrawerOpen:handleDrawerClose}
              edge="start"
              sx={{width:'70px',margin:'auto',height:'100% '}}
            >
              <img src={require("../../images/togglemenu.png")} alt="" height={'50%'} width={'60%'}/>
              {/* <MenuIcon sx={{height:'100%'}}/> */}
            </IconButton>
          </div>   
          <span className="main-logo">FOOTBALL-TANK</span>         
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader sx={{background:'#214162'}}>

        </DrawerHeader>
        <List>
          {['Dashboard', 'Users','Notifications', 'Manage Contents', 'Plans'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }} onClick={()=>{
              navigate(text==='Dashboard'?'/admin':`/admin/${text.toLowerCase().replace(' ','-')}`,{state:{open:open}})
            }}>
              <ListItemButton
                sx={{   
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color:'white'
                  }}
                >
                  {text==='Dashboard'?<DashboardIcon/>:text==='Users'?<ManageAccountsIcon/>:
                  text==='Notifications'?<MailIcon/>:text==='Manage Contents'?<ContentPasteIcon/>:
                  text==='Plans'?<StarsIcon/>:''}              
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 ,color:'white'}} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>   
      </Drawer>    
      <Box component="main" sx={{ flexGrow: 1, minHeight:'100vh',background:'#EDE8E8'}}>          
        <DrawerHeader sx={{background:'white',minHeight:'120px !important',marginBottom:'30px',justifyContent:'left !important',alignItems:'flex-end'}}>
          <h2 style={{lineHeight:'1'}}>&nbsp;&nbsp;&nbsp;&nbsp;{props.page}</h2>
        </DrawerHeader>
        <div style={{background:'white',width:'95%',margin:'auto',borderRadius:'5px',padding:'15px'}}>
            {props.page==="Users"?(
              <>
                <h2>Manage Users</h2>
                <UserTable/>
              </>
            ):''}    
        </div>                                                                  
      </Box>
    </Box>
  );
}