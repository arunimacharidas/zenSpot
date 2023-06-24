const userModel = require("../models/user-model")
const ordermodel=require('../models/order-models')
const categoryModel =require('../models/category-models')
const productModel = require('../models/product-model')
module.exports = {
    getAllusers: () => {
        return new Promise((resolve, reject) => {
            userModel.find().then((Allusers) => {
                resolve(Allusers)
            }).catch((err) => {
                console.log(err)
                reject(err)
            })

        })
    },
   

    blockUser: (id) => {
        return new Promise(async (resolve, reject) => {
            let user = await userModel.findOne({ _id: id })
            if (user.status === true) {
                userModel.findOneAndUpdate({ _id: id }, { $set: { status: false } },{new:true}).then((newuser) => {
                    
                })
            } else {
                userModel.findOneAndUpdate({ _id: id }, { $set: { status: true }},{new:true}).then((newuser) => {
                 

                })
            }
            resolve()
        })
    },
    getallorders: () => {
        return new Promise(async (resolve, reject) => {
            await ordermodel.find({status:'Delivered'}).then((orders) => {
                resolve(orders)
            }).catch(() => {
                reject()
            })
        })
    },
    ChangeOrderstatus:(details)=>{
        return new Promise((resolve,reject)=>{
            ordermodel.updateOne({_id:details.orderId},{$set:{status:details.status}}).then((order)=>{
                resolve(order.status)
            })
        })
    },
    getSalesDetails: () => {
        return new Promise((resolve, reject) => {
            ordermodel.aggregate([
                {
                    $group: {
                        _id: { $month: "$date" },
                        totalAmount: { $sum: "$totalAmount" }
                    }
                }
            ]).then((salesByMonth) => {
                resolve(salesByMonth);
            }).catch((error) => {
                reject(error);
            });
        });
    },
    getYearlySalesDetails: () => {
        return new Promise((resolve, reject) => {
            ordermodel.aggregate([
                {
                    $group: {
                        _id: { $year: "$date" },
                        totalAmount: { $sum: "$totalAmount" }
                    }
                }
            ]).then((salesByYear) => {

                resolve(salesByYear);
            }).catch((error) => {
                reject(error);
            });
        });
    },
    getOrdersByDate: async () => {
        try {
            const ordersByDate = await ordermodel.aggregate([
                {
                    $group: {
                        _id: {
                            month: { $month: "$date" },
                            year: { $year: "$date" }
                        },
                        count: { $sum: 1 }
                    }
                }
            ]);
            return ordersByDate;
        } catch (error) {
            throw new Error(error);
        }
    },
    getCategorySales: async () => {
        try {
            const orders = await ordermodel.find().populate('products.id', 'productCategory');
            const categorySales = {};
    
            orders.forEach(order => {
                order.products.forEach(product => {
                    const category = product.id?.productCategory;
                    if (category) {
                        if (category in categorySales) {
                            categorySales[category] += 1;
                        } else {
                            categorySales[category] = 1;
                        }
                    }
                });
            });
            const allCategories = await categoryModel.find()
            const result = allCategories.map(category => {
                const count = categorySales[category.name] || 0
                return  { name: category.name, count }
                
            })
            return result;
        } catch (error) {
            throw error;
        }
    },
    coundprod:()=>{
        return new Promise((resolve,reject)=>{
            productModel.find().then((prod)=>{
                resolve(prod)
            }).catch(()=>{
                reject()
            })
        })

    },
    singleOrder: (orderId) => {
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
                    totalAmount: order.totalAmount
                }
                resolve(orderDetails)
            }).catch((err) => {
                reject(err)
            })
        });
    },
  

 
}











