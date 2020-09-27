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

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const products = await Product.find(
    { $text : { $search : ctx.query.query } },
    { score : { $meta: 'textScore' } }
  ).sort({ score : { $meta : 'textScore' } });
  ctx.body = {products: products.map(mapProduct)};
  return next();
};
