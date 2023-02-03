import express from "./express.js";
import controller from "./controller.js";

const app = new express();
const PORT = 3000;

app.get("/users", controller.GET);
app.get("/users/:id", controller.GET);
app.post("/users", controller.POST);
app.put("/users/:id", controller.PUT);


app.delete("/users/:id", controller.DELETE);

app.listen(PORT, console.log(`Server: http://localhost:${PORT}`));
