const layout = 'layouts/admin-layout';
const productHelpers = require('../helpers/product-helpers');
const productHelper = require('../helpers/product-helpers');


module.exports = {

  getAddProducts: (req, res) => {
    productHelper.DisplayAllcategory().then((categories) => {
      res.render('admin/admin-addproducts', { layout, categories,product:true ,addProduct:true});
    })
  },

  getAddcategory: (req, res) => {
    productHelper.DisplayAllcategory().then((allCategories) => {
      res.render('admin/admin-category', { layout, allCategories,product:true,category:true });
    }).catch((error) => {

    })
    
  },

  getNewcategory: (req, res) => {
    console.log(req.body);
    productHelper.addNewcategory(req.body).then((response) => {
      res.json({addNewcategory:response.data,status:response.status})
    }).catch((error) => {
      console.log(error)

    })
  },
  fetchAllcategory: (req, res) => {
    productHelper.DisplayAllcategory(req.body).then((DisplayAllcategory) => {

    })


  },
  editcategory:(req,res)=>{
    const id = req.params.id
    productHelpers.geteditcategory(id).then((category)=>{
      res.render('admin/edit-category',{layout,category})
    })

  },
  categoryupdate:(req,res)=>{
    const category = req.body.categoryname
    const id = req.body.hiddenname
    productHelpers.changecategory(id,category).then(()=>{
      res.redirect('/admin/addcategory')
    }).catch(()=>{
      res.redirect('/admin/edit')
    })
  
  },
  blockcategory:(req,res)=>{
    const id = req.params.id
    productHelpers.statuschange(id).then(()=>{
      res.redirect('/admin/addcategory')
    }).catch(()=>{
      res.redirect('/admin')
    })

  },

  SetProducts: (req, res) => {
    const product = req.body
    const image = req.files.map((file) => {
      return file.filename
    })
    productHelper.addProducts(product, image).then(() => {
      res.redirect('/admin/addproducts')
    }).catch((err) => {
      res.redirect('/admin/allproducts')
    })
  },
geteditproduct: (req, res) => {
    const id = req.params.id
    productHelper.getAllCategory().then((categories) => {
      productHelper.singleProduct(id).then((product) => {
        res.render('admin/edit-products', { product, layout, categories })
      })
    })


  },
  singleproducts: async (req, res) => {
    let cartcount = null

    const user = req.session.user
    if (user) {
      cartcount = await getCartCount(user._id)
    }
    const id = req.params.id
    singleProduct(id).then((product) => {
     res.render('User/singleProduct', { product, user, cartcount: cartcount })
    })


  },

  posteditProduct: (req, res) => {
   
    const product = req.body
    const id = req.params.id
    let files = req.files
    let image
    if (!files) {

      image = null

    } else {
      image = files.map((file) => {
        return file.filename
      })
    }
    
    productHelper.editProduct(id, product, image).then(() => {
      res.redirect('/admin/products')
    }).catch((error) => {
      res.redirect('/admin/products')
    })
  },

  blockproduct: (req, res) => {
    const id = req.params.id
    productHelper.blockProduct(id).then(() => {

      res.redirect('/admin/products')
    }).catch((error) => {
      res.redirect('/admin/home')
    })
  },
  

  postShowproducts: (req, res) => {
    productHelper.showProducts().then((products) => {
      res.render('admin/Allproducts', { layout, products ,product:true,listProduct:true});
    }).catch((error) => {

    })
  }
    
}








