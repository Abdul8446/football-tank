import React, { useEffect, useState } from 'react'
import './news-section.css'
import axios from '../../axios/axios'
import { Box, CircularProgress } from '@mui/material'
import { getTimeAgo } from './getTimeAgo'
import { useNavigate } from 'react-router-dom'

function NewsSection() {
  const navigate = useNavigate()  
  const [newsList,setNewsList]=useState([])
  const [loading,setLoading] = useState(true)
  const [loadingNext,setLoadingNext] = useState(false)
  let [page, setPage] = useState(1);  

  const fetchNews=()=>{
      axios.get('/news',{params:{page:page}}).then(res=>{
          setLoading(false)
          setNewsList(prevNewsList => [...prevNewsList, ...res.data.data]);
          setPage(page+=1);
      })
  }  

  
  useEffect(()=>{
      fetchNews()
      window.addEventListener('scroll', handleScroll);
      // Clean up event listener when component unmounts
      return () => {
      window.removeEventListener('scroll', handleScroll);
      };
},[]) 

const handleScroll=()=>{
  if(window.innerHeight + window.scrollY >= document.body.offsetHeight){ 
    if(page>5){
        setLoadingNext(false)
        return
    } 
      setLoadingNext(true)
      fetchNews()
    // alert('end of screen')
  }
}


  return (
    <>
    <div className='news-sect'>
        {loading ? (
            <Box sx={{ display: 'flex' ,justifyContent:"center"}}>
            <CircularProgress />
            </Box>
        ) : (
            ""
        )}
        {newsList && newsList.map((news,i)=>(           
            <div key={i} className='news-title' onClick={()=>navigate(`/news/${news.id}`,{state:{news}})}>    
                <img src={news.image.data.urls.uploaded.embed} alt="" width='130px' height='80px' style={{borderRadius:'5px'}}/>   
                <div style={{fontWeight:'bold',marginLeft:'10px',maxWidth:'60%'}}>{news.title}</div>
                <div style={{marginLeft:'auto'}}>{getTimeAgo(news.created_at)}</div>
            </div>           
        ))}
        {loadingNext ? (
            <Box sx={{ display: 'flex' ,justifyContent:"center"}}>
            <CircularProgress />
            </Box>
        ) : (
            ""
        )}
    </div>    
    </>
  )
}

export default NewsSection
