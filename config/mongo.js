const mongoose = require("mongoose");

const connect_mongo = (db_url) => {
  mongoose
    .connect(db_url)
    .then(() => {
      console.log("mongo connected successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connect_mongo;
