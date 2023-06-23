var express = require('express');
var router = express.Router();
const { isloggedIn}=require('../middlewares/usermiddleware')
const userControllers = require('../controllers/userControllers')
const productHelper = require('../helpers/product-helpers');
const productControllers = require('../controllers/productControllers');
const {login,postLogin,signup,postSignup,Logout,otplogin,otpvalidation,Otpverify,Oneproduct,resendOtp,forgottenpassword,forgotOtp,forgotverify,newpassword,getShop,addToCart,getCart,removeproducts,cartClear,quantitychange,getcheckout,postcheckout,deleteOrder,placeOrder,getaddress,postaddress,alladdress,deleteadress,OneOrder,userprofile,orderdelete,passchange,changepass,invoice,category_filter,verifypayment} = require('../controllers/userControllers')
router.use(userControllers.homemiddlewares)

router.get('/', function(req, res, next) {
  const user = req.session.user
  productHelper.showProducts().then((products)=>{
    console.log(products);
    res.render('user/home',{user,products,home:true});  
  })
  
});


router.get('/login',login) 
router.post('/login',postLogin)
/******************************************************************login********************************************************************* */

router.get('/signup',signup)
router.post('/signup',postSignup)
/*******************************************************************signup********************************************************************* */

router.get('/logout',isloggedIn,Logout)
/********************************************************************logout******************************************************************** */
router.get('/otpphone',otplogin)
router.post('/otpphone',otpvalidation)
router.post('/otp-verify',Otpverify)
router.post('/resendOtp',resendOtp)
/*********************************************************************otp*********************************************************************** */
router.get('/quickview/:id',Oneproduct)
/********************************************************************singleproduct**************************************************************** */
router.get('/forgotphone',forgottenpassword)
router.post('/forgotphone',forgotOtp)
router.post('/forgottenpassword',forgotverify)
router.post('/newPassword',newpassword)
/********************************************************************newpassword***************************************************************** */
router.get('/shop',getShop)
/********************************************************************shop************************************************************************** */

router.get('/add-cart/:id',isloggedIn, addToCart)
router.get('/cart',isloggedIn,getCart)
router.get('/cartremove/:id',removeproducts)
router.get('/clearcart/:id',cartClear)
router.get('/category_filter/:id',category_filter)
router.post('/product-quantity-change',quantitychange)
/********************************************************************cart************************************************************************* */
router.get('/checkout',isloggedIn,getcheckout)
router.post('/checkout',postcheckout)
/********************************************************************checkout********************************************************************** */
router.post('/change-product-quantity',deleteOrder)
router.get('/orderplaced',placeOrder)
/*******************************************************************order************************************************************************** */
router.get('/addaddress',isloggedIn,getaddress)
router.post('/addaddress',isloggedIn,postaddress)
router.get('/alladdress',isloggedIn,alladdress)
router.get('/deleteaddress/:id',isloggedIn,deleteadress)
/********************************************************************address************************************************************************ */
router.get('/singleorder/:id',isloggedIn,OneOrder)
router.post('/changeOrderStatus',isloggedIn,orderdelete)
/*********************************************************************singleorder******************************************************************** */
router.get('/profile',isloggedIn,userprofile)
/***********************************************************************userprofile******************************************************************* */
router.get('/changepass',isloggedIn,passchange)
router.post('/changepass',isloggedIn,changepass)
/***********************************************************************password chaange*************************************************************** */
router.get('/invoice/:id',isloggedIn,invoice)
router.post ('/verify-payment',isloggedIn,verifypayment)
/*************************************************************************invoice********************************************************************** */
router.get('/category_filter/:id',category_filter)
/*************************************************************************category filter**************************************************************** */
router.get('/order-placed',placeOrder)







module.exports = router;
