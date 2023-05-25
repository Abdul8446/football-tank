const User = require('../Models/UserModel')
const Features = require('../Models/FeaturesModel')
require('dotenv').config()
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const axios = require('axios')

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')
         
const bucketName=process.env.AWS_BUCKET_NAME
const bucketRegion = process.env.AWS_BUCKET_REGION
const accessKey=process.env.AWS_ACCESS_KEY
const secretAccessKey=process.env.AWS_SECRET_KEY

const s3 = new S3Client({   
    credentials:{
        accessKeyId:accessKey,                                                                        
        secretAccessKey:secretAccessKey, 
    },
    region:bucketRegion,      
})

const getHomepage = async (req,res,next)=>{                                              
    try {        
        const user=req?.user
        let features = await Features.find() 
        if(user){
            res.status(200).json({user:user,features:features});   
        }else{
            res.json({features:features})
        }
    } catch (error) {
        res.json({error:error.message})
    }
}
     
const getNavbar = async (req,res)=>{
    try {
        let navMatches = await axios.get(
          "https://prod-public-api.livescore.com/v1/api/app/date/soccer/" +
            req.query.defaultTimeStamp +
            "/5.30?MD=1"
        );
        res.json({navMatches:navMatches.data})
      } catch (error) {
        res.json(error);
      }
}

const addProfilePicture = async (req,res)=>{
    try {
        const {userid} = req.body
        const file = req.file
        const imageName = randomImageName()
        const uploadParams = {
            Bucket:bucketName,
            Body:file.buffer,
            Key:imageName,
            ContentType:file.mimetype
        }      
        const command = new PutObjectCommand(uploadParams)      
        await s3.send(command)

        await User.findByIdAndUpdate(userid,{pic:imageName})

        const getObjectParams={
            Bucket:bucketName,
            Key:imageName,
        }
        const getCommand = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, getCommand,{expiresIn:100000});
        res.json({imageName:url}) 
    } catch (error) {
        res.json({error:error.message})
    }
}

const changeProfilePicture = async (req,res)=>{
    try {
        const {userid} = req.body
        const file = req.file
        const user = await User.findById(userid)

        const deleteParams = {
            Bucket:bucketName,
            Key:user.pic
        }
        const deleteCommand = new DeleteObjectCommand(deleteParams)
        await s3.send(deleteCommand)

        const imageName = randomImageName()
        const uploadParams = {
            Bucket:bucketName,
            Body:file.buffer,
            Key:imageName,
            ContentType:file.mimetype
        }      
        const command = new PutObjectCommand(uploadParams)      
        await s3.send(command)

        await User.findByIdAndUpdate(userid,{pic:imageName})

        const getObjectParams={
            Bucket:bucketName,
            Key:imageName,
        }
        const getCommand = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, getCommand,{expiresIn:100000});
        res.json({imageName:url}) 
    } catch (error) {
        res.json({error:error.message})
    }
}

const deleteProfilePicture= async (req,res)=>{
    try {
        const userId = req.params.id
        const user = await User.findById(userId)

        const deleteParams = {
            Bucket:bucketName,
            Key:user.pic
        }
        const deleteCommand = new DeleteObjectCommand(deleteParams)
        await s3.send(deleteCommand)
        const updatedUser = await User.findByIdAndUpdate(userId,{pic:null})
        res.send(updatedUser)
    } catch (error) {
        res.json({error:error.message})   
    }
}

const getImageUrl = async (req,res)=>{
    try {
        const user = await User.findById(req.query.userId)
        if(!user.pic){
            res.send({imageNotFound:true})
        }else{
            const getObjectParams={
                Bucket:bucketName,
                Key:user.pic,
            }
            const getCommand = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, getCommand,{expiresIn:100000});
            res.json({imageName:url}) 
        }
    } catch (error) {
        res.json({error:error.message})     
    }
}

const verifyOldPassword = async (req,res)=>{
    try {
        const {userId, password} = req.query
        const user = await User.findById(userId)

        const authPassword=await bcrypt.compare(password.toString(),user.password)
        if(authPassword){
            res.json({verified:true})
        }else{
            res.json({verified:false})
        }
    } catch (error) {
        res.json({error:error.message})
    }
}

const updateProfile = async (req,res)=>{
    try {     
        if(req.body.newPassword){
            const newPassword = await bcrypt.hash(req.body.newPassword, 10);
            await User.findByIdAndUpdate(req.body.userId,{password:newPassword})
            res.json({passwordUpdated:true})
        }else if(req.body.newName){
            const user = await User.findByIdAndUpdate(req.body.userId,{name:req.body.newName},{new:true})
            res.json({newUserData:user,nameUpdated:true})
        }else if(req.body.newEmail){
            const user = await User.findByIdAndUpdate(req.body.userId,{email:req.body.newEmail},{new:true})
            res.json({newUserData:user,emailUpdated:true})
        }else if(req.body.newPhone){
            const user = await User.findByIdAndUpdate(req.body.userId,{phone:req.body.newPhone},{new:true})
            res.json({newUserData:user,phoneUpdated:true})
        }
    } catch (error) {       
        res.json({error:error.message})
    }
}

const addOrRemoveFromFavoriteMatches = async (req,res) => {
    const matchObj={
        competitionId:req.body.match.competition.competitionId,
        competition:req.body.match.competition,
        match:[req.body.match.match]
    }
    try {
        const competitionFind=await User.find({_id:req.body.userId,"favorites.matches.competitionId":matchObj.competitionId})
        if(competitionFind.length!==0){
            const favorites=await User.find({_id:req.body.userId, "favorites.matches.match.matchId":matchObj.match[0].matchId})
            if(favorites.length!=0){   
                const updatedUser= await User.findOneAndUpdate({_id:req.body.userId,"favorites.matches.competitionId":matchObj.competitionId},
                {$pull:{"favorites.matches.$.match":{"matchId":matchObj.match[0].matchId}}},{new:true})
                const index = updatedUser.favorites.matches.findIndex(match => match.match.length === 0);
                const emptyMatchIndexes = updatedUser.favorites.matches.reduce((indexes, match, index) => {
                    if (match.match.length === 0) {
                    indexes.push(index);
                    }
                    return indexes;   
                }, []);
                
                if (emptyMatchIndexes.length > 0) {
                    emptyMatchIndexes.sort((a, b) => b - a);
                
                    emptyMatchIndexes.forEach((index) => {    
                    updatedUser.favorites.matches.splice(index, 1);
                    });
                
                    await updatedUser.save({new:true});
                    res.json({updatedUser:updatedUser})
                }
            }else{
                const updatedUser= await User.findOneAndUpdate({_id:req.body.userId,"favorites.matches.competitionId":matchObj.competitionId},
                {$push:{"favorites.matches.$.match":req.body.match.match}},{new:true})    
                res.json({updatedUser:updatedUser,message:'Match added to favorites'})
            }
        }else{
            const updatedUser= await User.findByIdAndUpdate(req.body.userId,{
                $push:{"favorites.matches":matchObj}
            },{new:true})
            res.json({updatedUser:updatedUser,message:'Match added to favorites'})
        }
    } catch (error) {
        res.status(400).json({error:error.message}) 
    }
}

const removeFinishedFromFavoriteMatches = async (req,res) => {
    try {
        if(req.body.finishedMatchIds.length==0){
            res.json({message:'No matches to remove'})
        }
        const updatedUser = await User.findOneAndUpdate(
            { _id: req.body.userId,"favorites.matches.match.matchId":{$in:req.body.finishedMatchIds}},
            {$pull:{"favorites.matches.$.match":{"matchId":{ $in: req.body.finishedMatchIds } } } },
            {multi:true,new:true}
          );
          
          if (updatedUser) {   
            const index = updatedUser.favorites.matches.findIndex(match => match.match.length === 0);
            const emptyMatchIndexes = updatedUser.favorites.matches.reduce((indexes, match, index) => {
                if (match.match.length === 0) {
                  indexes.push(index);
                }
                return indexes;   
            }, []);
            
            if (emptyMatchIndexes.length > 0) {
                emptyMatchIndexes.sort((a, b) => b - a);
              
                emptyMatchIndexes.forEach((index) => {    
                  updatedUser.favorites.matches.splice(index, 1);
                });
              
                await updatedUser.save({new:true});
                res.json({updatedUser:updatedUser})
            }
          }
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

const addOrRemoveFromFavoriteCompetitions = async (req,res)=>{
    try {
        const competitionFind = await User.find({_id:req.body.userId,"favorites.competitions.competitionId":req.body.competition.competitionId})
        if(competitionFind.length!==0){
            const updatedUser= await User.findByIdAndUpdate(req.body.userId,{
                $pull:{'favorites.competitions':{'competitionId':req.body.competition.competitionId}}
            },{new:true})
            res.json({updatedUser:updatedUser})
        }else{
            const updatedUser= await User.findByIdAndUpdate(req.body.userId,{
                $push:{'favorites.competitions':req.body.competition}
            },{new:true})
            res.json({updatedUser:updatedUser})
        }
    } catch (error) {
        res.json({error:error.message})
    }
}

const addOrRemoveFromFavoriteTeams = async (req,res)=>{
    try {
        const teamFind = await User.find({_id:req.body.userId,"favorites.teams.teamId":req.body.team.teamId})
        if(teamFind.length!=0){
            const updatedUser= await User.findByIdAndUpdate(req.body.userId,{
                $pull:{'favorites.teams':{'teamId':req.body.team.teamId}}
            },{new:true})
            res.json({updatedUser:updatedUser})
        }else{
            const updatedUser= await User.findByIdAndUpdate(req.body.userId,{
                $push:{'favorites.teams':req.body.team}
            },{new:true})
            res.json({updatedUser:updatedUser})
        }
    } catch (error) {
        res.json({error:error.message})
    }
}

module.exports={
    addOrRemoveFromFavoriteCompetitions,
    addOrRemoveFromFavoriteTeams,
    removeFinishedFromFavoriteMatches,
    addOrRemoveFromFavoriteMatches,
    updateProfile,verifyOldPassword,
    getImageUrl,deleteProfilePicture,
    changeProfilePicture,addProfilePicture,
    getNavbar,getHomepage
}                 