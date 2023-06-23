const { resolveInclude } = require('ejs');
const userModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const accountSid = 'AC2c8b8738c611568527d76c9c6ecd8fc6';
const authToken = '5a18cc2d92b67f464e96bad33830d3dd';
const productModel = require('../models/product-model');
const ordermodel = require('../models/order-models')
const { response } = require('express');
const categoryModel = require('../models/category-models');
const PDFDocument = require('pdfkit')
const fs = require('fs')
const doc = new PDFDocument()
const client = require('twilio')(accountSid, authToken);


module.exports = {
    postSignup: (data) => {
        return new Promise((resolve, reject) => {
            userModel.findOne({ email: data.Email }).then((userExist) => {
                if (userExist) {
                    reject()
                } else {
                    bcrypt.hash(data.password, 10, (err, hashpass) => {
                        if (err) {
                            reject()
                        } else {
                            new userModel({
                                name: data.Name,
                                password: hashpass,
                                email: data.Email,
                                phone: data.Number
                            }).save().then((newuser) => {
                                resolve(newuser)
                            }).catch((err) => {
                                reject(err)
                            })
                        }
                    })
                }
            })
        })

    },

    postLogin: (loginData) => {
        return new Promise((resolve, reject) => {
            userModel.findOne({ email: loginData.Email, status: true }).then((user) => {
                if (!user) {
                    reject()
                } else {
                    bcrypt.compare(loginData.Password, user.password).then((status) => {
                        if (status) {
                            let response = {}
                            response.user = user,
                                response.status = status
                            resolve(response)
                        } else {
                            reject()
                        }
                    }).catch((err) => {
                        reject(err)
                    })
                }
            })
        })
    } ,

    otpGenerate: (phonenumber) => {
        return new Promise((resolve, reject) => {
            userModel.findOne({ phone: phonenumber, status: true }).then((user) => {
                if (user) {
                    client.verify.v2.services('VAdbd0e8ae7614095d1b06f6a4ddfe82a3')
                        .verifications
                        .create({ to: `+91${user.phone}`, channel: 'sms' })
                        .then(verification => console.log(verification.status))
                        .catch(error => {

                            console.log(error.message);
                        })
                    resolve()
                } else {
                    reject()

                }
            })
        })
    },
    
    Otpverify: (req, res) => {
        


        //  userHelper.verifyOtp(otp,phone).then((response)=>{
        //    console.log(response, "response from otp login")
        //    if(response.status){
        //      console.log(response.status,'ldskfldkfldksf')
        //      req.session.user = response.user
        //      res.redirect('/')
        //    }else{
        //      let Err= "invalid otp"
        //      res.render('user/otp',{layout:false,Err})
        //    }
        //  }).catch((Err)=>{
        //    console.log(Err)
        //    res.redirect('user/signup')
        //  })

    },
   
    ProductSingle: (id) => {
        return new Promise((resolve, reject) => {
            productModel.findOne({ _id: id }).then((OneProduct) => {
                resolve(OneProduct)
            }).catch((err) => {
                reject(err)
            })
        })
    },
   
    forgottenpasswordGenerate: (phonenumber) => {
        return new Promise((resolve, reject) => {
            userModel.findOne({ phone: phonenumber, status: true }).then((user) => {
                if (user) {
                    client.verify.v2.services('VAdbd0e8ae7614095d1b06f6a4ddfe82a3')
                        .verifications
                        .create({ to: `+91${user.phone}`, channel: 'sms' })
                        .then(verification => console.log(verification.status))
                        .catch(error => {
                        })
                    resolve()
                } else {
                    reject()

                }
            })
        })



    },
   
    forgotverify: (req, res) => {
    },
   
    newpassword: async (password, phone) => {
        return new Promise((resolve, reject) => {
            if (password) {
                bcrypt.hash(password, 10, (err, hashpass) => {
                    if (err) {
                       
                        reject()
                    } else {
                       
                        userModel.updateOne({ phone: phone }, {
                            $set: {
                                password: hashpass
                            }
                        }).then((response) => {
                           
                            resolve()
                        })
                            .catch((err) => {
                                reject(err)
                            })


                    }
                })
            }

        })





    },
   
    getProducts: (pageNum) => {
        return new Promise((resolve, reject) => {
                const perPage = 4;
                const skipCount = (pageNum - 1) * perPage;
                productModel.countDocuments({}).then((totalCount) => {
                    const totalPages = Math.ceil(totalCount / perPage);
                    productModel.find()
                      .sort({ createdAt: -1 })
                      .skip(skipCount)
                      .limit(perPage)
                      .then((response) => {
                        resolve({products:response,totalPages})
                       
                      })
                      .catch((err) => {
                      
                      });
                  });
                  
        })
    },
    placeOrder: (order, Products) => {
        order.totalamount=parseInt(order.totalamount)
        
        let newproducts = Products.map((product) => ({
            id: product.productId,
            quantity: product.quantity
        }));
        return new Promise((resolve, reject) => {
            let Status = order.payment_option === 'cod' ? 'placed' : 'pending';
            userModel.findById(order.userId).then((user)=>{
                new ordermodel({
                    userId: order.userId,
                    state: order.state,
                    name: order.name,
                    billing_address: order.billing_address,
                    zipcode: order.zipcode,
                    status: Status,
                    totalAmount: order.totalamount,
                    city: order.city,
                    date: new Date(),
                    district: order.district,
                    payment_option: order.payment_option,
                    phone: order.phone,
                    products: newproducts
                }).save().then(async(newOrder) => {
                    user.address=await newOrder.save()
                    resolve(newOrder);
                }).catch(() => {
                    reject();
                });

            })

        });
    },
    DeleteOrders:(details)=>{
        return new Promise((resolve,reject)=>{
            ordermodel.updateOne({_id:details.orderId},{$set:{status:details.status}}).then((order)=>{
                resolve(order.status)
            }).catch((err)=>{
                reject()
            })
        })
    },
    PostAddress:(address,id)=>{
        return new Promise((resolve,reject)=>{
            userModel.findById(id).then((user)=>{
                user.address.push(address)
                user.save()
                resolve()
            }).catch(()=>{
                reject()
            })
        })
    },
    getOneOrder: (orderId) => {
        return new Promise((resolve, reject) => {
            ordermodel.findById(orderId).populate('products.id').exec().then((order) => {
                const products = order.products.map(product => {
                    if (product.id) {
                        return {
                            id: product.id._id,
                            name: product.id.productTitle,
                            description: product.id.productDescription,
                            category: product.id.productCategory,
                            price: product.id.productPrice,
                            quantity: product.quantity,
                            images: product.id.productimage[0]
                        }
                    }
                });
                const orderDetails = {
                    id: order._id,
                    userId: order.userId,
                    name: order.name,
                    billingAddress: order.billing_address,
                    city: order.city,
                    state: order.state,
                    zipcode: order.zipcode,
                    phone: order.phone,
                    paymentOption: order.payment_option,
                    status: order.status,
                    products: products,
                    date: order.date,
                    totalAmount: order.totalAmount,
                    images:order.images
                }
                resolve(orderDetails)
            }).catch((err) => {
                reject(err)
            })
        });
    },
    getOrders: (id) => {
        return new Promise(async (resolve, reject) => {
            await ordermodel.find({ userId: id }).then((orders) => {
                resolve(orders)
            }).catch(() => {
                reject()
            })
        })
    },
    DeleteOrders:(details)=>{
        return new Promise((resolve,reject)=>{
            ordermodel.updateOne({_id:details.orderId},{$set:{status:details.status}}).then((order)=>{
                resolve(order.status)
            }).catch((err)=>{
                reject()
            })
        })
    },
    ChangePass: (num, pass) => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(pass, 10, (err, hashedpassword) => {
                if (err) {
                    reject()
                }
                userModel.updateOne({ phone: num }, { $set: { password: hashedpassword } }).then((status) => {
                    resolve(status)
                }).catch(() => {
                    reject()
                })
            })
        })
    },
    userAddres:(id)=>{
        return new Promise((resolve,reject)=>{
            userModel.findById(id).then((user)=>{
                resolve(user.address)
            }).catch(()=>{
                reject()
            })
        })
        
    },
    deleteAddress:(id,x)=>{
        return new Promise((resolve,reject)=>{
            userModel.findById(id).then((user)=>{
                user.address.splice(x,1)
                user.save()
                resolve()
            }).catch(()=>{
                reject()
            })
        })

    },
    generateInvoice: (orderDetails) => {
        console.log(orderDetails)
        return new Promise((resolve, reject) => {
            const { id, name, billingAddress, city, district, state, zipcode, phone, paymentOption, status, products, date, totalAmount } = orderDetails;

            formattedDate = date.toLocaleDateString('en-GB')

            doc.font('Times-Roman').fontSize(18).text('INVOICE', { align: 'center' });
            doc.fontSize(15).text('Shipping Address', 50, 150)
            doc.fontSize(12).text(`Name: ${name}`, 50, 180)
                .text(`Office/House No.: ${billingAddress}`)
                .text(`City: ${city}`)
                .text(`District: ${district}`)
                .text(`State: ${state}`)
                .text(`Zipcode: ${zipcode}`)
                

            doc.fontSize(15).text('Order Details', 345, 150)
            doc.fontSize(12).text(`Invoice No: ${id}`, 345, 180)
                .text(`Purchase Date: ${formattedDate}`)
                .text(`Total Amount: ${totalAmount}`)
                .text(`Payment Mode: ${paymentOption}`)
            doc.moveTo(30, 300).lineTo(580, 300).stroke();
            doc.moveTo(30, 140).lineTo(580, 140).stroke();
            doc.moveTo(30, 170).lineTo(580, 170).stroke();


            doc.fontSize(15).text('No.', 50, 340)
                .text('Name', 100, 340)
                .text('Quantity', 350, 340)
                .text('Unit Price', 450, 340)
                .text('Amount', 550, 340)

            let y = 370;
            products.forEach(({ name, price, quantity }, index) => {
                y += 30;
                doc.fontSize(12)
                    .text(`${index + 1}`, 50, y)
                    .text(name, 100, y)
                    .text(quantity, 350, y)
                    .text(price, 450, y)
                    .text(price * quantity, 550, y)
            })
            doc.fontSize(16).text('Subtotal', 400, y + 50)
            doc.fontSize(18).text(`${totalAmount}`, 550, y + 50)

            const stream = doc.pipe(fs.createWriteStream('invoice.pdf'));
            stream.on('finish', () => {
                console.log('PDF created');
                resolve();
            });
            doc.end();
        });
    },
    
}  
