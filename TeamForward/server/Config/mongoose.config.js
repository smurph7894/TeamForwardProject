const mongoose = require("mongoose");
const KEY = process.env.ATLAS_PW;
const USER_KEY = process.env.ATLAS_USER;
const dbname = 'TeamForward';

mongoose
  .connect(
    `mongodb+srv://${USER_KEY}:${KEY}@cluster0.2k0d84x.mongodb.net/${dbname}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify:false
    }
  )
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.log(err));
