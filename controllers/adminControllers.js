const adminHelper = require('../helpers/admin_helpers');
const products = require('../models/product-model');
const couponHelpers = require('../helpers/coupon-helpers')
const categoryModel = require('../models/category-models')
const layout = 'layouts/admin-layout'
module.exports = {

  getAdminlogin: (req, res) => {
    if (req.session.admin) {
      res.render('admin/admin-home',{ layout,dashboard:true })
    } else {
      res.render('admin/admin-login', { layout: false });
    }

  },
  /***********admin loginside********************* */

  postAdminlogin: (req, res) => {
    const admin = req.body
    console.log(admin);
    const adminCredientials = {
      email: "admin@gmail.com",
      password: "admin"
    }
    if (admin.email === adminCredientials.email && admin.password === adminCredientials.password) {
      req.session.admin = admin

      res.redirect('/admin/admin-dashboard')
    } else {
      res.redirect('/admin')
    }
/********************************admin password and email**************** */


  },
  adminhome: (req, res) => {
    res.render('admin/admin-home', { layout,dashboard:true });
  },
  /**************************admin home page*************************/

  adminAllusers: (req, res) => {
    adminHelper.getAllusers().then((Allusers) => {
      res.render('admin/All-users', { layout, Allusers,users:true });
    })
  },
  /*************allusers display********************************** */
  adminLogout: (req, res) => {
    req.session.admin = null
    res.redirect('/admin')

  },
  /*********************************adminlogout********************** */
  UserStatus: (req, res) => {
    const id = req.params.id
    adminHelper.blockUser(id).then(() => {
      res.redirect('/admin/allusers')
    })

  },
  getAllOrders: async (req, res) => {
    await adminHelper.getallorders().then((orders) => {

        res.render('admin/orderlist', { layout, orders })
    })
},
orderStatus: (req, res) => {
  adminHelper.ChangeOrderstatus(req.body).then((status) => {
      res.json(status)
  })
},
getcoupon:(req,res)=>{
  res.render('Admin/admin-addcoupoen')
},
postcoupon:(req,res)=>{
  console.log('::::::::::::::::::::::::::::admin-addcoupon')
  console.log(req.body,'}}}}}}}}}}}}}}}}}}}}}}}}}}}')
  couponHelpers.couponAdd(req.body).then(()=>{
    res.redirect('/admin/admin-allcoupens')
  })

},
allcoupon:(req,res)=>{
  couponHelpers.Allcoupon(req.body).then((coupens)=>{
    res.render('admin/admin-allcoupens',{layout,coupens})
  })
},
couponstatus:(req,res)=>{
 const id =  req.params.id 
 couponHelpers.Couponstatus(id).then(()=>{
  res.redirect('admin/admin-allcoupoens')

 })
},
orderstatuschange:(req,res)=>{
  adminHelper.ChangeOrderstatus(req.body).then((status)=>{
    res.json(status)
  })
},
dashboard:async (req, res) => {

  if (req.session.admin) {
      const salesByMonth = await adminHelper.getSalesDetails()
      const salesByYear = await adminHelper.getYearlySalesDetails()
      const ordersByDate = await adminHelper.getOrdersByDate()
      const categorySales = await adminHelper.getCategorySales()
      const currmonth = new Date().getMonth() + 1
      const currmonthsale = await salesByMonth.find(sales => sales._id === currmonth)
      console.log(currmonthsale,"ffffffffffffffffffffffffffffffffffffffffffffff")
      const prod = await adminHelper.coundprod()



     adminHelper.getallorders().then((orders) => {

          res.render('admin/admin-dashboard', { layout, orders, currmonthsale, salesByMonth, salesByYear, ordersByDate, prod, categorySales })
      })
  } else {
      res.redirect('/admin')
  }

},



}

























