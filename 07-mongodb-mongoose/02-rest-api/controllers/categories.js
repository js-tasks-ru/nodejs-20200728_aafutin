const Category = require('../models/Category');

function mapSubcategory(subcategory) {
  return {
    id: subcategory.id,
    title: subcategory.title,
  };
}

function mapCategory(category) {
  return {
    id: category.id,
    title: category.title,
    subcategories: category.subcategories.map(mapSubcategory),
  };
}

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find();
  ctx.body = {categories: categories.map(mapCategory)};
  return next();
};
