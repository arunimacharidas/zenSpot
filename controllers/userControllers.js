
const { trusted } = require('mongoose')
const userHelper = require('../helpers/user-helper')
const productHelpers = require('../helpers/product-helpers')
require("dotenv").config();

const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const services = process.env.services
const userModel = require('../models/user-model')
const cartHelpers = require('../helpers/Cart_helpers');
const Cart_helpers = require('../helpers/Cart_helpers');
const cart = require('../models/cart-model');
const adminControl = require('../controllers/adminControllers')
const couponHelpers = require('../helpers/coupon-helpers');
const client = require('twilio')(accountSid, authToken);
const categorySchema=require('../models/category-models')

const productSchema=require('../models/product-model')
module.exports = {
  homemiddlewares:(req,res,next)=>{
    const userId = req.session.user?._id
    if(userId){
        cartHelpers.getCartCount(userId).then((cartcounts) => {
      res.locals.cartcount=cartcounts
  })
    }
      next();
    
  
  },

login: function (req, res) {
    if (req.session.user) {
      res.redirect('/')
    } else {
      res.render('user/login')
    }
  },
 postLogin: (req, res) => {
    let user = req.body

    userHelper.postLogin(user).then((status) => {
      if (status) {
        req.session.user = status.user

        res.redirect('/')
      } else {
        res.redirect('/login')
      }
    }).catch((err) => {
      res.redirect('/login')
    })

  },
signup: function (req, res, next) {

    res.render('user/signup')
  },
 postSignup: async (req, res) => {
    let data = req.body
    userHelper.postSignup(data).then((newuser) => {
      req.session.user = newuser
      res.redirect('/login')
    }).catch((err) => {
      res.redirect('/signup')
    })
  },
 

 Logout: (req, res) => {
    req.session.user = null;
    res.redirect('/')
  },
  
otplogin: function (req, res) {
    res.render('user/otpphone', )

  },
  
otpvalidation: function (req, res) {
    const phonenumber = req.body.Number
    req.session.phone = phonenumber
    userHelper.otpGenerate(phonenumber).then((response) => {
      res.render('user/otp', )
    }).catch((err) => {
      console.log(err)
      res.redirect('/login')
    })
  },
  
Otpverify: async (req, res) => {
    const otp = req.body.otp
    const phone = req.session.phone
    client.verify.v2.services
      .verificationChecks
      .create({ to: `+91${phone}`, code: otp })
      .then(async (verification) => {
        if (verification.status === 'approved') {
          const user = await userModel.find({ phone: phone })
          req.session.user = user
          res.redirect('/')
        } else {
          let Err = "invalid otp"
          res.render('user/otp', {  Err })
        }
      }); 
},
resendOtp: (req, res) => {
  const phone = req.session.phone
  userHelper.otpGenerate(phone).then(() => {
    res.send()
  })
},

Oneproduct: (req, res) => {
    const id = req.params.id;
    const user = req.session.user
     userHelper.ProductSingle(id)
      .then((Oneproduct) => {
        res.render('user/singleproduct', { Oneproduct,user});
      })
      .catch((err) => {
        res.redirect('/');
      });
  }, 

forgottenpassword: function (req, res) {
    res.render('user/forgotphone')

  },
forgotOtp: function (req, res) {
    const phonenumber = req.body.Number
    req.session.phone = phonenumber
    userHelper.forgottenpasswordGenerate(phonenumber).then((response) => {
      res.render('user/forgottenOtp', { layout: false })
    }).catch((err) => {
      res.redirect('/login')
    })
  },
  
forgotverify: async (req, res) => {
  
    const otp = req.body.otp
    const phone = req.session.phone
    client.verify.v2.services
      .verificationChecks
      .create({ to: `+91${phone}`, code: otp })
      .then(async (verification) => {
        if (verification.status === 'approved') {
          const user = await userModel.find({ phone: phone })
          req.session.user = user
          res.render('user/forgottenpassword')
        } else {
          let Err = "invalid otp"
          res.render('user/forgottenOtp', { layout: false, Err })
        }
      }).catch(error => {
       
      })


  },
  
resendOtp: (req, res) => {
    const phone = req.session.phone
    userHelper.forgottenpasswordGenerate(phone).then(() => {
      res.send()
    })
  },
  
newpassword: (req, res) => {
    const phone = req.session.phone
    userHelper.newpassword(req.body.password,phone).then(()=>{
      res.redirect('/login')
    })
  },

getShop: async (req, res) => {
    try {
      let page = req.query.page ?? 1;
      const response = await userHelper.getProducts(page);
      let products = response.products;
      let pages = response.totalPages;
      const user = req.session.user
  
      const category = await categorySchema.find();
  
      res.render('user/shop', { products, shop: true, pages, page,category,user });
    } catch (error) {
      
      res.status(500).send('Internal Server Error');
    }
  }
  ,
   addToCart: (req, res) => {
    const id = req.params.id;
    const userId = req.session.user._id;
    
    cartHelpers.CartAdd(id, userId).then(() => {
      cartHelpers.getCartCount(userId).then((cartcount) => {
            res.json({ status: true, cartcount: cartcount })
        })

    }).catch((err) => {
     
        res.redirect('/')
    })
},
getCart: (req, res) => {
    if (req.session.user) {
        const user = req.session.user
        const id = user._id
        
        cartHelpers.getaddcart(id).then((prod) => {
            cartprod = prod.cartprod
            prod = prod.result
            res.render('user/cart', { prod, user, cartprod })
        }).catch((err) => {
            res.render('user/cart', { prod: false })
        })
    } else {
        res.redirect('/login')
    }
},

category_filter: async (req, res) => {
  try {
    const id = req.params.id;
    const pageSize = 1;
    const category = await categorySchema.findOne({ _id: id }); 
    const user = req.session.user
    

    const products = await productSchema.find({ productCategory: category.name }); 
    
    const pages = Math.ceil(products.length / pageSize); 

    res.render('user/shop2', { category, products, pages,user });
  } catch (error) {
   
    res.status(500).send('Internal Server Error');
  }
},
removeproducts: (req, res) => {
    const user = req.session.user._id
    const id = req.params.id
    cartHelpers.ProductRemove(id, user).then(() => {
        res.redirect('/cart')
    }).catch((err) => {
        res.redirect('/cart')
    })
},
cartClear: (req, res) => {
    const user = req.session.user._id
    cartHelpers.Cartempty(user).then((response) => {
        res.redirect('/cart')
    }).catch((err) => {
        res.redirect('/shop')
    })
},
quantitychange: (req, res) => {
    cartHelpers.changeQuantity(req.body).then((response) => {
        res.json(response)
    }).catch((err) => {
        console.log(err);
    })
},
getcheckout: (req, res) => {
  const user = req.session.user
  userHelper.userAddres(user._id).then((address)=>{
    cartHelpers.getaddcart(user._id).then((prod) => {
   
      let  cartprod = prod.cartprod
      prod = prod.result
        couponHelpers.Allcoupon().then((coupens) => {
        
        
       
        res.render('user/checkout', { user, prod, cartprod, coupens, address })
    })


})
  })

},
postcheckout: async (req, res) => {
  let products = await cartHelpers.getCartProducts(req.body.userId)
  userHelper.placeOrder(req.body, products).then((response) => {
      if (response.payment_option === 'cod') {
       cartHelpers.Cartempty (req.body.userId).then(() => {
              res.json({ cod: true })
          })
      }
       else if(response.payment_option === 'online') {
          const total = req.body.totalamount
          const orderId = response._id;
         
          cartHelpers.generateRazorpay(orderId, total).then((order) => {
          
              res.json(order)
          })
      }
  }).catch((error) => {
      res.redirect('/shop')
  });
},
verifypayment: (req, res) => {

 cartHelpers.verifyPayment(req.body).then(() => {
      cartHelpers.changePaymentstatus(req.body['order[receipt]']).then(() => {
      cartHelpers.emptyCart(req.session.user._id).then(() => {
              res.json({ status: true })
          })
      }).catch((err) => {
          res.json({ status: false })
      })
  })
},

deleteOrder: (req, res) => {
 userHelper. DeleteOrders(req.body).then((response)=>{
      res.json(response)
  }).catch(()=>{
      res.render('user/Page-404')
  })
},
placeOrder: (req, res) => {
  const user = req.session.user
  res.render('user/order-placed',{user})
},
getaddress: (req, res) => {
  const user = req.session.user
  res.render('user/addaddress',{user})
},
postaddress: (req, res) => {
  const address = req.body
  const id = req.session.user._id
  
 userHelper.PostAddress(address, id).then(() => {
      res.redirect('/addaddress')
  }).catch(() => {
      res.render('user/Page-404')
  })
},
alladdress:(req,res)=>{
  const id = req.session.user._id
  const user = req.session.user
  userHelper.userAddres(id).then((address)=>{
   
    res.render('user/alladdress',{address,user})
  })


},
deleteadress:(req,res)=>{
  const id=req.session.user._id
  const index=req.params.id
  userHelper.deleteAddress(id,index).then(()=>{

      res.redirect('/alladdress')
  })

},
OneOrder: (req, res) => {
  const id = req.params.id
  userHelper.getOneOrder(id).then((orderdetails) => {
    
      let total = 0
      res.render('user/order_view', { orderdetails, total })
  })
},
userprofile: (req, res) => {
  const user = req.session.user
  userHelper.getOrders(user._id).then((orders) => {
      res.render('user/profile', { user, orders })
  }).catch(() => {
      res.redirect('/')
  })
},
orderdelete: (req, res) => {
 userHelper. DeleteOrders(req.body).then((response) => {
      res.json(response)
  }).catch(() => {
      res.render('user/Page-404')
  })
},
changepass: (req, res) => {

  const number = req.body.Number
  const password = req.body.password
 userHelper. ChangePass(number, password).then((response) => {

      res.redirect('/login')
  }).catch(() => {
      res.render('user/Page-404')
  })
},
passchange: (req, res) => {
  const number= req.session.user.phone
  const user = req.session.user

  res.render('user/changepass',{number,user})
},
invoice: (req, res) => {
  const Id = req.params.id
  userHelper.getOneOrder(Id).then((orderDetails) => {
    
      userHelper.generateInvoice(orderDetails).then(() => {
          res.download('invoice.pdf')
      }).catch((err) => {
          console.log('Error creating invoice PDF:', err);
      })
  })
}
}