const mongoose = require("mongoose");
const KEY = process.env.ATLAS_PW;
const USER_KEY = process.env.ATLAS_USER;
const dbName = 'TeamForward';

console.log(`mongodb+srv://${USER_KEY}:${KEY}@cluster0.2k0d84x.mongodb.net/${dbName}?retryWrites=true&w=majority`)

mongoose
  .connect(
    `mongodb+srv://${USER_KEY}:${KEY}@cluster0.2k0d84x.mongodb.net/${dbName}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify:false
    }
  )
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.log(err));
