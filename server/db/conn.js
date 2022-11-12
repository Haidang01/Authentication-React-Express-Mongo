
const mongoose = require('mongoose');

const DB = 'mongodb+srv://haidang15:haidang15@cluster0.e2lxr6s.mongodb.net/Authusers?retryWrites=true&w=majority';

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Database Connection');
}).catch((err) => {
  console.log(err);
});
