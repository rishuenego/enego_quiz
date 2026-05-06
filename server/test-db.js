const mongoose = require('mongoose');
const url = 'mongodb://harshsengar2005:welcome1234@ac-kjyp96q-shard-00-00.zutegiu.mongodb.net:27017/EnegoQuiz?tls=true&authSource=admin&directConnection=true';

mongoose.connect(url)
  .then(() => {
    console.log('Connected!');
    return mongoose.connection.db.admin().command({ isMaster: 1 });
  })
  .then(res => {
    console.log('Is Primary:', res.ismaster);
    console.log('Replica Set Name:', res.setName);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
