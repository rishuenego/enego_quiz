const mongoose = require('mongoose');
const url = 'mongodb://harshsengar2005:welcome1234@ac-kjyp96q-shard-00-00.zutegiu.mongodb.net:27017,ac-kjyp96q-shard-00-01.zutegiu.mongodb.net:27017,ac-kjyp96q-shard-00-02.zutegiu.mongodb.net:27017/EnegoQuiz?tls=true&replicaSet=atlas-14p41r-shard-0&authSource=admin&serverSelectionTimeoutMS=10000';

mongoose.connect(url)
  .then(() => {
    console.log('Connected! Testing query...');
    const User = mongoose.model('User', new mongoose.Schema({ name: String }), 'users');
    return User.findOne({});
  })
  .then(res => {
    console.log('Query result:', res);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
