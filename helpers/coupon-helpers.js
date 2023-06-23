const couponModel = require('../models/coupen-model')
module.exports={
    couponAdd:(details)=>{
        return new Promise((resolve,reject)=>{
            const newcoupon = new couponModel({
                code:details.code,
                validity:details.validity,
                name:details.name,
                minAmount:details.minamound,
                maxAmount:details.maxamound,
                perc:details.disperc

            })
            newcoupon.save().then((coupen)=>{
                resolve()
            })
            
        })
    },
    Allcoupon:()=>{
        return new Promise((resolve,reject)=>{
            couponModel.find().then((coupons)=>{
                resolve(coupons)
            })
        })
    },
    Couponstatus:(id)=>{
        return new Promise((resolve,reject)=>{
            couponModel.findById(id).then((coupons)=>{
                coupons.status =!coupons.status
                coupons.save()
                resolve()

            })
        })
    }
}


