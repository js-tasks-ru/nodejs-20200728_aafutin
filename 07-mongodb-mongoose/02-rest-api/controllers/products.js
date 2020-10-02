const Product = require('../models/Product');

function mapProduct(product) {
  return {
    id: product.id,
    title: product.title,
    images: product.images,
    category: product.category,
    subcategory: product.subcategory,
    price: product.price,
    description: product.description,
  };
}

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  if (ctx.query.subcategory) {
    const products = await Product.find({subcategory: ctx.query.subcategory});
    if (!products) {
      ctx.body = {products: []};
    } else {
      ctx.body = {products: products.map(mapProduct)};
    }
    return;
  }

  return next();
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();
  ctx.body = {products: products.map(mapProduct)};
  return next();
};

module.exports.productById = async function productById(ctx, next) {
  const product = await Product.findById(ctx.params.id);
  if (!product) {
    ctx.status = 404;
    ctx.body = {};
  } else {
    ctx.body = {product: mapProduct(product)};
  }
};

