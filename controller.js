const validator = require("./validation");

let users = validator.read("users");

module.exports = {
  GET: (req, res) => {
    try {
      let id = req.params?.id;
      if (id) {
        if (!users.map((u) => u.id).includes(+id))
          throw new Error("Not found " + id + "-user");
        else res.end(JSON.stringify(users.find((u) => u.id == id)));
      } else res.end(JSON.stringify(users));
    } catch (err) {
      res.end(err.message);
    }
  },
  POST: (req, res) => {
    try {
      const { name, username, email, phone } = req.body;
      validator.check(name, username, email, phone);
      let user = req.body;
      user["id"] = users.length ? users[users.length - 1].id + 1 : 1;
      users.unshift(user);
      validator.write("users", users);
      res.end(user.id + " User added ");
    } catch (error) {
      res.end(error.message);
    }
  },
  PUT: (req, res) => {
    try {
      const id = req.params?.id;
      let user = users.find((u) => u.id == id);
      if (!user) throw new Error("Not found " + id + "-user");
      const { name, username, email, phone } = req.body;
      if (!name || !username || !email || !phone)
        throw new Error("Not found maqsad!");
      user.name = name ? name : user.name;
      user.username = username ? username : user.username;
      user.email = email ? email : user.email;
      user.phone = phone ? phone : user.phone;
      validator.write("users", users);
      res.end("User " + id + " updated!");
    } catch (error) {
      res.end(error.message);
    }
  },
  DELETE: (req, res) => {
    try {
      const id = req.params?.id;
      if (!users.map((u) => u.id).includes(+id))
        throw new Error("Not found " + id + "-user");
      validator.write(
        "users",
        users.filter((u) => u.id != id)
      );

      res.end("User " + id + " deleted!");
    } catch (error) {
      res.end(error.message);
    }
  },
};
