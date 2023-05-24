import './news-details.css'
import { useLocation } from 'react-router-dom'


function NewsDetails() { 
  const location = useLocation()
  const {news} = location.state            
  
  return (
    <div className='news-details'>
      <h4 style={{marginLeft:'10px'}}>{news && news.title}</h4>
      <img src={news?.image?.data?.urls?.uploaded?.original} alt="" height='450px' width='100%'/>
      <span style={{fontSize:'12px',marginBottom:'40px'}}>{news?.image?.data?.description}</span>
      {news && news.body.map((para,i)=>(
        para.type==='editor_block'?(
          <>
          <div className='editor-block' key={i} dangerouslySetInnerHTML={{ __html: para.data.content }}></div>
          </>
        ):para.type==='embed'?(
          <>
          <div className='tweet-block' key={i}>
            <iframe className='iframe-component' 
            src={`https://platform.twitter.com/embed/Tweet.html?id=${para.data.content.replace(/^twitter:/, '')}`} 
            title="Embedded Tweet" scrolling='no' 
            onLoad={(event)=>{
                event.target.style.height=`${event.target.ownerDocument.scrollingElement.clientHeight}px`
            }} 
           ></iframe>
          </div>
          </>
        ):''        
      ))}
    </div>   
  )
}

export default NewsDetails
