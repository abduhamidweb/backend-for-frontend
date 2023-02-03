const fs = require("fs");
const path = require("path");

module.exports = {
  check: (name, username, email, phone) => {
    let nameRegex = new RegExp("^[a-zA-Z\\s]{3,15}$");
    let usernameRegex = new RegExp("^[a-zA-Z\\s]{3,15}$");
    let emailRegex = new RegExp(
      "^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\\.[a-zA-Z]+"
    );
    let phoneRegex = new RegExp(
      "^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$"
    );
    if (!nameRegex.test(name)) throw new Error("Wrong name!");
    if (!usernameRegex.test(username)) throw new Error("Wrong username!");
    if (!emailRegex.test(email)) throw new Error("Wrong email!");
    if (!phoneRegex.test(phone)) throw new Error("Wrong phone!");
  },
  read: (link) =>
    JSON.parse(
      fs.readFileSync(path.join(__dirname, "database", link + ".json"))
    ),
  write: (link, data) => {
    fs.writeFileSync(
      path.join(__dirname, "database", link + ".json"),
      JSON.stringify(data, null, 4)
    );
  },
};
