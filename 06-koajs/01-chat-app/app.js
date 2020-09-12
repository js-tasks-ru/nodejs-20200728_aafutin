const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let subscribers = {};

router.get('/subscribe', async (ctx, next) => {
  const id = Math.random();
  subscribers[id] = {};

  ctx.req.on('close', function() {
    delete subscribers[id];
  });

  return await new Promise((resolve) => {
    const waitMessage = setInterval(() => {
      if (subscribers[id].message) {
        ctx.body = subscribers[id].message;
        clearInterval(waitMessage);
        resolve();
      }
    }, 10);
  });
});

router.post('/publish', async (ctx, next) => {
  for (const id in subscribers) {
    subscribers[id].message = ctx.request.body.message;
  }
  ctx.body = '';
});

app.use(router.routes());

module.exports = app;