var express = require('express');
const { checkAdmin } = require('../Middlewares/AuthMiddlewares');
const { adminLogin } = require('../Controllers/AuthControllers');
const { adminHome, adminLoginGet, usersData, blockUser } = require('../Controllers/AdminControllers');
var router = express.Router();

router.get('/',checkAdmin,adminHome);
    //    
router.get('/login',checkAdmin,adminLoginGet)    

router.post('/login',adminLogin)

router.get('/users',checkAdmin,usersData)

router.put('/block-user',checkAdmin,blockUser)    

module.exports = router;
