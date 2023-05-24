require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
const User = require('../Models/UserModel')
const moment = require('moment');

module.exports.createPaymentIntent = async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: 99000,
          currency: "inr",
          automatic_payment_methods: {
            enabled: true,
          },
        });
      
        res.send({
          clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

module.exports.activatePremiumSubscription= async (req,res) => {
    try {
        const expirationDate = moment().add(1, 'month').toDate();
        const updatedUser=await User.findByIdAndUpdate(req.body.userId,{
            $set:{"premiumSubscription.activated":true,
            "premiumSubscription.expires": expirationDate
            }
        },{new:true})
        res.json(updatedUser)
    } catch (error) {   
        console.log(error)
        res.status(400).json({error:error.message})
    }
}