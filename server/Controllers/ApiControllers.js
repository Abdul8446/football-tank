require('dotenv').config()
const axios = require('axios')

module.exports.fetchMatches= async (req, res)=> {
    try {
      if ("timeStamp" in req.query) {
        // do something if the timestamp property is present
        const matchData = await axios.get(
            process.env.FETCH_MATCH_URL +
            req.query.timeStamp +
            "/5.30?MD=1"
        );
        res.json(matchData.data);
      } else {
        // do something else if the timestamp property is not present
        const matchData = await axios.get(
            process.env.FETCH_MATCH_URL +
            req.query.defaultTimeStamp +
            "/5.30?MD=1"
        );
        res.json(matchData.data);
      }
    } catch (error) {
      res.json(error);
    }
}

module.exports.competitionsList = async (req, res) => {
    try {   
      let complist = await axios.get(
        process.env.COMPETITIONS_LIST_URL
      );
      res.json(complist.data);
    } catch (error) {
      res.json(error);
    }
}

module.exports.subCompetitions = async (req, res) => {
    try { 
      let subCompetitionUrl=process.env.COMPETITIONS_LIST_URL +'/'+ req.query.subCompetition   
      let complist = await axios.get(subCompetitionUrl);    
      res.json(complist.data);
    } catch (error) {
      res.json(error);
    }
}

module.exports.featuredNews = async (req, res) => {
    try {
      let news = await axios.get(
        process.env.FEATURED_NEWS_URL,{
          headers:{
            'project':'livescore.com'
          }
        }
      );    
      res.json(news.data);
    } catch (error) {
      res.json(error);
    }
}

module.exports.matchDetails=async (req,res)=>{
    try {
        const matchDetails=await axios.get(req.query.url)
        res.json(matchDetails.data.pageProps.initialEventData)
    } catch (error) {
        res.json(error);       
    }
}     

module.exports.commentary=async (req,res)=>{        
    try {
        const commentaries=await axios.get(`${process.env.COMMENTARIES_URL}/${req.query.matchId}/comments?locale=en`)
        res.json(commentaries.data.Com)
    } catch (error) {
        res.json(error)
    }
}    

module.exports.matchInfo=async (req,res)=>{
    try {      
        const info=await axios.get(req.query.url)
        res.json(info.data.pageProps.initialEventData.event)
    } catch (error) {
        res.json(error)
    }    
}

module.exports.matchStats=async (req,res)=>{
    try {      
        const stats=await axios.get(req.query.url)
        res.json(stats.data.pageProps.initialEventData.event.statistics)
    } catch (error) {
        res.json(error)
    }    
}

module.exports.competitionOverview=async (req,res)=>{
    console.log(req.query.url)
    try {      
        const overview=await axios.get(req.query.url)
        res.json(overview.data.Stages[0])
    } catch (error) {
        res.json(error)
    }    
}

module.exports.teamOverview = async (req,res)=>{
    try {
        const teamOverview = await axios.get(req.query.url)    
        res.json(teamOverview.data.pageProps)
    } catch (error) {
        res.json(error)
    }
}

module.exports.getAllTeamDetails = async (req,res)=>{
    try {
        console.log(req.query)
        if(req.query.fixturesUrl!=='false'){
            const fixtures=await axios.get(req.query.fixturesUrl)
            const results=await axios.get(req.query.resultsUrl)
            res.json({fixtures:fixtures.data,results:results.data})
        }else if(req.query.tablesUrl!=='false'){
            const tables=await axios.get(req.query.tablesUrl)
            res.json({tables:tables.data})
        }else if(req.query.newsUrl!=='false'){
            const news=await axios.get(req.query.newsUrl)
            res.json({news:news.data})
        }else if(req.query.statsUrl!=='false'){
            const stats=await axios.get(req.query.statsUrl)
            res.json({stats:stats.data})
        }else if(req.query.newStatsUrl!=='false'){
            const newStats=await axios.get(req.query.newStatsUrl)
            res.json({newStats:newStats.data})
        }
    } catch (error) {
        res.json(error)   
    }
}

module.exports.getAllPlayerStats = async (req,res)=>{
    try {
        console.log(req.query)
        if(req.query.goalsUrl!=='false'){
            const goals=await axios.get(req.query.goalsUrl)
            res.json({goals:goals.data})
        }    
    } catch (error) {
        res.json(error)   
    }
}

module.exports.getNewsList=async (req,res)=>{
    const page=req.query.page
    try {
        const newsList=await axios.get(`https://content.api.uk1.sportal365.com/articles/search/?query=*&page=${page}&status=active&category=2021020913320920836`,{
            headers:{
              'project':'livescore.com',
              'sec-fetch-mode':'cors',
              'authorization':'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiODA5ZmRmYWY4MDM1YTRmZGU0MmRmOWJhMTUwYWY3N2VkNzE1ZjBjZDAwMWQwOTZhY2VkMjQ1MzFmZmNjYmEwN2M5OThlMWExNjhiOWUzODMiLCJpYXQiOjE2ODA1MjM3ODUuMjQ4NTYsIm5iZiI6MTY4MDUyMzc4NS4yNDg1NjUsImV4cCI6MTcxMjE0NjE4NS4yMzQzMTksInN1YiI6IjIwMjEwMTI2MDkxMjQwNDkxMjYiLCJzY29wZXMiOltdfQ.aZWj7x3md-9-0LFguTgQ66ugEiNz5iSYn0_sS1Fe1g_uvuvWRaWQbDUBxOA_7nmuFNrWUS7DII4sj439I1IkPi8m8BEJvFoAuW6fIDMVR-XZwIzfkxqDlKHOO0Rw_YeuuKb9lj_cehjeMhLUWs_ZTu1XNnKeZLHHwe3r2n6k52xD_hqfDVIAHIzQVpxQ0btU-KFUtipbx90CxCYWuoeurm_OGHIZWh0MvXOGSngSpJw2AxSkTwBVoIMYrxEn-fth5z2E23uV4oPPE9HTz7zTDJAtlsL3pWoGMpsiDmJGXUbRn3aVztM8wzFKe5zsog3VlqXmP4m9MhdTwD6XhU7wcK11VzRNoR9hPaguLrY4ppRkWgigz5m8dXzXeKLPPO2vsR_GeERdS1Tzaq6Mb6y19om2ZlyBJHthiMurAo9v3vY9u71a17Fjc_Ok2UKgHB3IYAO_5M7Z8uMTyNVJClnZOVnasgQ5LCPNx43QaPfwAQdJC2-CYsfjK-Bk9cjnwUrqVXfOE0JZTtxD1ZjPrYdnv4oNLSOrJqSbkFSMS53BUQADiwFTrwWfvL-i6SwImujxZFZPirSVIC59YAfTI4ubpNZ8f-d-tU_0CGNOp26bgvBY7krgaX7GsJ6cuX45Sz-ZgXd1B2jXp2ra77yFvgTLJbReKpNLV9WW5o0EqHOUxg4'
            }
          })
        res.json(newsList.data)
    } catch (error) {   
        console.log(error)
    }
}  

module.exports.lineUps=async (req,res)=>{
    try {      
        const lineUps=await axios.get(req.query.url)
        res.json(lineUps.data)
    } catch (error) {
        res.status(400).json({error:error.message})
    }    
}

module.exports.h2h=async (req,res)=>{
    try {      
        const h2h=await axios.get(req.query.url)
        res.json(h2h.data)
    } catch (error) {
        console.log(error)
        res.status(400).json({error:error.message})
    }    
}

