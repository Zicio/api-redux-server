const http = require("http");
const Koa = require("koa");
const Router = require("koa-router");
const cors = require("koa2-cors");
const koaBody = require("koa-body");
const { v4: uuidv4 } = require("uuid");

const options = {
  origin: "*",
};

const app = new Koa();

app.use(cors(options));
app.use(koaBody({ json: true, urlencoded: true }));

let services = [
  {
    id: uuidv4(),
    name: "Купить ноутбук",
    price: "20000",
    content: "Ноутбук LENOVO",
  },
  {
    id: uuidv4(),
    name: "Заменить стекло",
    price: "2000",
    content: "Стекло оригинал",
  },
];

const router = new Router();

router.get("/services", async (ctx, next) => {
  const serviceId = ctx.request.query.id;
  if (serviceId) {
    const service = services.find((o) => o.id === serviceId);
    if (service) {
      ctx.response.body = service;
    }
  } else {
    ctx.response.body = services;
  }
});

router.post("/services", async (ctx, next) => {
  const data = JSON.parse(ctx.request.body);
  const { id } = data;
  if (id !== 0) {
    services = services.map((o) => (o.id !== id ? o : data));
    ctx.response.status = 204;
    return;
  }
});

router.delete("/services", async (ctx, next) => {
  const serviceId = ctx.request.query.id;
  const index = services.findIndex((o) => o.id === serviceId);
  if (index !== -1) {
    services.splice(index, 1);
  }
  ctx.response.status = 204;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());
server.listen(port, () => console.log("server started"));
