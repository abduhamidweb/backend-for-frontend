const http = require("http");

const callbacks = {};
async function Server(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, OPTIONS, PUT , DELETE"
  );
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type");

  if (req.method == "OPTIONS") return res.end();
  if (req.url == "/favicon.ico") return;
  let route = req.url.toLowerCase();
  let method = req.method.toUpperCase();
  let url = req.url.split("/"); //    /users  | /users/1
  if (url[2] && checkPath(route)) {
    let key = checkPath(route); //       /users/:id
    let arg = key.split("/:"); //      ['/users','id']
    req.params = {};
    req.params[arg[1]] = url[2]; //    { id: 5}
    route = key; //                    /users/:id
  }

  if (method == "POST" || method == "PUT") {
    req.body = await new Promise((res, rej) => {
      let datas = "";
      req.on("data", (data) => (datas += data));
      req.on("end", () => res(JSON.parse(datas)));
    });
  }

  if (callbacks[route]?. [method]) callbacks[route][method](req, res);
  else res.end(`Cannot path ${method}${route}`);
}

function checkPath(route) {
  for (let key in callbacks) {
    if ("path" in callbacks[key]) {
      let regUrl = [...route.matchAll(callbacks[key]["path"])];
      if (regUrl[0][0] == regUrl[0]["input"]) return key;
    }
  }
  return 0;
}

function regExp(route) {
  let rot = route.split("/:"); //   [ /users , id ]
  return new RegExp(`${rot[0]}/\\w+`, "gi");
}

class Express {
  #server = http.createServer(Server);
  get(route, callback) {
    route = route.toLowerCase();
    callbacks[route] = callbacks[route] || {};
    callbacks[route]["GET"] = callbacks[route]?.GET || callback;
    if (route.includes(":")) callbacks[route]["path"] = regExp(route); // /users/:id
  
  }

  post(route, callback) {
    route = route.toLowerCase();
    callbacks[route] = callbacks[route] || {};
    callbacks[route]["POST"] = callbacks[route]?.POST || callback;
  }

  put(route, callback) {
    route = route.toLowerCase();
    callbacks[route] = callbacks[route] || {};
    callbacks[route]["PUT"] = callbacks[route]?.PUT || callback;
    if (route.includes(":")) callbacks[route]["path"] = regExp(route);
  }

  delete(route, callback) {
    route = route.toLowerCase();
    callbacks[route] = callbacks[route] || {};
    callbacks[route]["DELETE"] = callbacks[route]?.DELETE || callback;
    if (route.includes(":")) callbacks[route]["path"] = regExp(route);
  }

  listen(port, callback) {
    this.#server.listen(port, callback);
  }
}

module.exports = Express;