const mongoose = require("mongoose");
const connectionString =
  process.env.MONGODB_URI || "mongodb://localhost:27017/honeydew-core";
const configOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

mongoose
  .connect(connectionString, configOptions)
  .then(() => console.log("You have successfully connected to MongoDB..."))
  .catch((err) => console.log(err));

function _closeConnection() {
  mongoose.connection.close();
}

module.exports = {
  mongooseConnection: mongoose.connection,
  _closeConnection,
  User: require("./User"),
  Space: require("./Space"),
  Task: require("./Task"),
};
