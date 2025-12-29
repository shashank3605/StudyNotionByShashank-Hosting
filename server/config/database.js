// const mongoose = require('mongoose')
// require("dotenv").config();






// exports.connect=() => {
//     mongoose.connect(process.env.MONGODB_URL, {
//         useNewUrlParser: true,
//         useUnifiedTopology:true,
//     })
//     .then(() => console.log("DB Connected Successfully"))
//     .catch((error) => {
//         console.log("DB Connection Failed");
//         console.error(error);
//         process.exit(1);
//     })
// };



// last wala ye tha
const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  const mongoURI = process.env.MONGODB_URL;

  if (!mongoURI) {
    console.error("MONGODB_URL is not defined in .env");
    process.exit(1);
  }

  mongoose
    .connect(mongoURI)  // 👈 just pass the URI, no options
    .then(() => console.log("DB Connected Successfully"))
    .catch((error) => {
      console.log("DB Connection Failed");
      console.error(error);
      process.exit(1);
    });
};
