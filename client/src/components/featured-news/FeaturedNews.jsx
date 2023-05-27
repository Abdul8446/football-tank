import React, { useContext, useEffect } from 'react'
import './featured-news.css'
import axios from 'axios'
import { Skeleton } from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import { FeaturesContext } from '../../contexts/userContext'

function FeaturedNews() {
    const {featuredNews,setFeaturedNews}=useContext(FeaturesContext)
    
    const fetchNews=async ()=>{
      try {
        let res=await axios.get(`api/featured-news`)
        if(res.data?.data?.items){
          setFeaturedNews(res.data.data.items)
        }else{
          fetchNews()
        }
      } catch (error) {
        toast(error.message)
      }
    }
      
    useEffect(()=>{
      fetchNews();
    },[])
      
  return (
    <>
    <div className='news-section'>
      <div className='news-section-title' style={{fontWeight:"bold"}}>Featured News</div>
      <hr />
      {featuredNews.length===0?Array.from({ length: 4 }, (_, index) => (
      <div key={index}><Skeleton variant="rounded" width='100%' height='170px' sx={{marginBottom:'20px'}} /></div>
      ))
      :featuredNews.slice(0,4).map((article,i)=>(
        <div key={i} className='article' style={{backgroundImage: `url(${article.data.image.data.urls.uploaded.original})`}}>
            <p className="article-title">{article.data.title}</p>
        </div>
      ))}   
    </div>    
    <ToastContainer/>
    </>
  )
}

export default FeaturedNews
