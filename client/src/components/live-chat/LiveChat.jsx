import React,{useState,useEffect, useContext} from 'react'
import './live-chat.css'
import io from 'socket.io-client'
import { UserContext } from "../../contexts/userContext";
import { Avatar, ChatContainer, Message, MessageInput, MessageList,TypingIndicator } from '@chatscope/chat-ui-kit-react'
// import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { getTimeAgo } from '../news-section/getTimeAgo';
import { Box, CircularProgress } from '@mui/material';
import avatarUrl from '../../assets/images/admin-avatar.webp'

var socket


function LiveChat({chatroomId,eventStatus}) {
 const {userData} = useContext(UserContext)   
 const [messages, setMessages] = useState([
   {
     username: 'Footballtank',
     id: '',
     avatarUrl:avatarUrl,
     text: "Insulting words are not welcome here. Let's communicate in a polite way",
     timestamp: '',
     type: "text",
     direction:"incoming"           
   },
  {
    username: 'Footballtank',
    id: '',
    avatarUrl: avatarUrl,
    text: 'Hey guys, Who is waiting for this match? Leave your name now!',
    timestamp: '',
    type: "text",
    direction:"incoming"              
  }
 ]);
//  const [loadingMore, setLoadingMore] = useState(false);
//  const [loadedMessages, setLoadedMessages] = useState([]);
//  const [counter, setCounter] = useState(0);
 const [chatLoading,setChatLoading]=useState(false)
 const [typing, setTyping] = useState(false)
 const [typer, setTyper] = useState()
 


  useEffect(() => {
    setChatLoading(true)
    socket=io(process.env.REACT_APP_SERVER_URL)
    // Join the chat room
    socket.emit("joinRoom", chatroomId);

    return () => {
      // Leave the chat room
      socket.emit("leaveRoom", chatroomId);
  
      // Stop listening for chat messages
      socket.off("message");
      socket.off("output");
    }  
  }, []);      
  
  useEffect(()=>{
     // Retrieve chat messages from the server
     socket.on("output", (data) => {
      if(data.error){
        setChatLoading(false)
        return
      }
      const msgdata=[]                     
      data.map(msg=>{
        if (msg.username && msg.userid && msg.chattext && msg.timestamp) {
          msgdata.unshift(
            {
              username: msg.username,
              id: msg.userid,
              //   avatarUrl: "https://image.flaticon.com/icons/svg/2446/2446032.svg"
              text: msg.chattext,
              timestamp: msg.timestamp,
              type: "text",
              direction:msg.userid === userData._id ? "outgoing" : "incoming"           
            }
          );
        }  
      })   
      setMessages([...msgdata,...messages]);
      setChatLoading(false)
    });

    // Listen for chat messages
    socket.on("message", (data) => {
      const msgdata= { 
        username: data[data.length-1].username,
        userid:data[data.length-1].userid,
        //   avatarUrl: "https://image.flaticon.com/icons/svg/2446/2446032.svg"
        text: data[data.length-1].chattext,
        timestamp: data[data.length-1].timestamp,  
        type: "text",
        direction:'incoming'
      }
      if(msgdata.userid!==userData._id){
        setMessages([
          msgdata,
          ...messages,
        ]);
      }
    });

    socket.on('typing',(data)=>{
      if(data._id!==userData._id){
        setTyping(true)
        setTyper(data.name)
        setTimeout(()=>{
          setTyping(false)
        },2000)
      }
    })
  },[messages,chatroomId])
                   
  const handleOnSendMessage = (message) => {
    socket.emit("message", {
        chatroomid: chatroomId,
        username: userData.name,
        userid: userData._id,
        chattext: message,
        timestamp: +new Date()
    });

    setMessages([
      { 
        username: userData.name,
        userid:userData._id,
        //   avatarUrl: "https://image.flaticon.com/icons/svg/2446/2446032.svg"
        text: message,
        timestamp: +new Date(),
        type: "text",
        direction:'outgoing'
      },
      ...messages,
    ]);
  };

  const typingOn=()=>{
    socket.emit('typing',{userdata:userData,chatroomid:chatroomId})   
  }        
  
  return (
    <>
    <div style={{display: "grid",border: "1px solid #292c2f",marginTop: "15px",maxHeight:'300px',overflowY:'hidden'}}>
        <ChatContainer style={{height:'300px'}}>
          <MessageList style={{height:'500px'}} >
           {chatLoading?<Box sx={{display:'flex',justifyContent:'center'}}><CircularProgress/></Box>:''}
           {messages.length > 0 && <div style={{display:'flex',flexDirection:'column-reverse'}}>
           {messages.map((msg,index)=>(  
            <>      
             <Message key={index} model={{  
               message:msg.text,       
               sentTime:msg.timestamp,     
               sender:msg.username, 
               ...msg.direction==='outgoing' && {direction:msg.direction}
              }}>                                      
                  <Avatar src={msg.avatarUrl} name={'admin'} size='sm'/>          
                  {msg.direction!=='outgoing'?<Message.Footer sender={msg.username} sentTime={msg.timestamp===''?'':getTimeAgo(msg.timestamp)} />:''}
              </Message>                                    
            </>   
           ))}    
           </div>}
          </MessageList>
        </ChatContainer>
    </div>
    {typing?<TypingIndicator style={{paddingLeft:'10px'}} content={`${typer} is typing`} />:''}
    {eventStatus==='PAST'?<MessageInput placeholder="The chatroom is already closed" disabled sendButton={false} attachButton={false}/>
    :<MessageInput placeholder="Type message here..." onKeyDown={typingOn} onSend={(e)=>handleOnSendMessage(e)}/>}
    </>    
  );            
}


export default LiveChat         



