const Koa = require('koa');
const Router = require('koa-router');
const {productsBySubcategory, productList, productById} = require('./controllers/products');
const {categoryList} = require('./controllers/categories');
const mongoose = require('mongoose');

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = {error: err.message};
    } else {
      console.error(err);
      ctx.status = 500;
      ctx.body = {error: 'Internal server error'};
    }
  }
});

function validateObjectId(ctx, next) {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
    ctx.status = 400;
    ctx.body = {message: 'invalid id'};
    return;
  }
  return next();
}

const router = new Router({prefix: '/api'});

router.get('/categories', categoryList);
router.get('/products', productsBySubcategory, productList);
router.get('/products/:id', validateObjectId, productById);

app.use(router.routes());

module.exports = app;
