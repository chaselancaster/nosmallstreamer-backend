const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected')
});

mongoose.connection.on('error', err => {
    console.log(err, 'Mongoose failed to connect')
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose is disconnected')
});

mongoose.set('useFindAndModify', false);