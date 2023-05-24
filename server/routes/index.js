var express = require("express");
var router = express.Router();
const axios = require("axios");
const mongoose = require('mongoose')
const { signup, login } = require('../Controllers/AuthControllers');
const { checkUser } = require("../Middlewares/AuthMiddlewares");
const { matchDetails, commentary, matchInfo, matchStats, competitionOverview, teamOverview, getAllTeamDetails, getAllPlayerStats, getNewsList, lineUps, h2h, fetchMatches, competitionsList, subCompetitions, featuredNews } = require("../Controllers/ApiControllers");
const multer = require('multer');
const { addProfilePicture, changeProfilePicture, deleteProfilePicture, getImageUrl, verifyOldPassword, updateProfile, addOrRemoveFromFavoriteMatches, removeFinishedFromFavoriteMatches, addOrRemoveFromFavoriteCompetitions, addOrRemoveFromFavoriteTeams, getNavbar, getHomepage } = require("../controllers/UserControllers");
const { createPaymentIntent, activatePremiumSubscription } = require("../Controllers/SubscriptionControllers");
const storage = multer.memoryStorage()
const upload = multer({storage:storage})



// connect to MongoDB database
mongoose
  .connect("mongodb://127.0.0.1:27017/football-tank", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error(error));

 
/* GET home page. */
router.get("/",checkUser,getHomepage);

router.get('/fetch-matches',fetchMatches)

router.get("/competitions-list",competitionsList);

router.get("/sub-competitions",subCompetitions);

router.get("/featured-news",featuredNews);

router.get("/navbar",getNavbar);

router.post('/signup',signup)

router.post('/login',login)   

router.get('/match-details',matchDetails)

router.get('/commentary',commentary)

router.get('/match-info',matchInfo)

router.get('/match-stats',matchStats)

router.get('/competition-overview',competitionOverview)

router.get('/team-overview',teamOverview)

router.get('/get-all-team-details',getAllTeamDetails)   
    
router.get('/get-all-player-stats',getAllPlayerStats)

router.get('/news',getNewsList)
      
router.post('/add-profile-picture',upload.single('file'),addProfilePicture)

router.put('/change-profile-picture',upload.single('file'),changeProfilePicture)

router.delete('/delete-profile-picture/:id',deleteProfilePicture)

router.get('/get-image-url',getImageUrl)

router.get('/verify-old-password',verifyOldPassword)       

router.put('/update-profile',updateProfile)

router.put('/add-or-remove-from-favorite-matches',addOrRemoveFromFavoriteMatches)

router.put('/remove-finished-from-favorite-matches',removeFinishedFromFavoriteMatches)

router.put('/add-or-remove-from-favorite-competitions',addOrRemoveFromFavoriteCompetitions)

router.put('/add-or-remove-from-favorite-teams',addOrRemoveFromFavoriteTeams)

router.get('/line-ups',lineUps)

router.get('/h2h',h2h)

router.post('/create-payment-intent',createPaymentIntent)

router.put('/activate-premium-subscription',activatePremiumSubscription)
   
module.exports = router;

      