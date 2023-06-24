var express = require('express');
var router = express.Router();
const bycrpt = require('bcrypt')
const upload = require('../middlewares/multer')
// const db = require('../models/connection')
const {getAdminlogin,postAdminlogin,adminhome,adminAllusers,adminLogout, UserStatus,getAllOrders,orderStatus,getcoupon,postcoupon,allcoupon,couponstatus,orderstatuschange,dashboard,adminorderdetails,Getallorderslist} = require('../controllers/adminControllers')
const {getAddProducts,getAddcategory,getNewcategory,SetProducts, postShowproducts,geteditproduct, blockproduct,posteditProduct,editcategory,categoryupdate,blockcategory} = require('../controllers/productControllers');
const{isadminloggedIn}= require("../middlewares/adminmiddleware");
const { isloggedIn } = require('../middlewares/usermiddleware');



/* GET home page. */
router.get('/',isadminloggedIn,getAdminlogin) 
router.post('/',postAdminlogin)
/*******************************************************************adminlogin************************************************************************** */
router.get('/adminlogout',isadminloggedIn,adminLogout)
/*******************************************************************adminlogout************************************************************************* */
// router.get('/admin-home',isadminloggedIn,adminhome)
router.get('/allusers',isadminloggedIn,adminAllusers)
/*******************************************************************Allusers****************************************************************************** */
router.get('/allusers/:id',isadminloggedIn,UserStatus)
/*******************************************************************Userstatus***************************************************************************** */
router.get('/addproducts',isadminloggedIn,getAddProducts)
router.get('/addcategory',isadminloggedIn,getAddcategory)
router.post('/addcategory',isadminloggedIn,getNewcategory)
router.get('/editcategory/:id',editcategory)
router.post('/editcategory',categoryupdate)
router.get('/blockcategory/:id',blockcategory)
/*******************************************************************category******************************************************************************** */
router.get('/products',isadminloggedIn,postShowproducts)
router.post('/addproducts',isadminloggedIn, upload.array('image',4), SetProducts)
/*********************************************************************products****************************************************************************** */
router.get('/editproduct/:id',isadminloggedIn,geteditproduct)
router.post('/editproduct/:id',isadminloggedIn, upload.array('image',4),posteditProduct)
router.get('/blockproduct/:id',isadminloggedIn,blockproduct)
/***********************************************************************products***************************************************************************** */
router.get('/orderlists',isadminloggedIn,getAllOrders)
router.get('/orders', Getallorderslist)
router.post('/changeOrderStatus',orderStatus)
/***********************************************************************Allorders***************************************************************************** */
router.get('/admin-addcoupoen',getcoupon)
router.post('/admin-addcoupoen',postcoupon)
router.get('/admin-allcoupens',allcoupon)
router.get('/coupenstatus/:id',couponstatus)
/*************************************************************************Coupon******************************************************************************* */
router.post('/ChangeOrderstatus',orderstatuschange)
/*************************************************************************orderstatus************************************************************************** */
router.get('/admin-dashboard',isadminloggedIn,dashboard)
router.get('/orderdetails/:id',isadminloggedIn,adminorderdetails)
/*************************************************************************dasboard******************************************************************************* */




module.exports = router;
