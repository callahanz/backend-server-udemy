// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Importar Rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');


// Inicializar variables
var app = express();


// Body Parser
// parse application/x-www-form-urlencoded
// parse application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Conexión a la base de datos
// https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
// *** Start MongoDB
// $ sudo service mongod start
// *** Verify that MongoDB has started successfully
// $ cat /var/log/mongodb/mongod.log
// *** Stop MongoDB
// $ sudo service mongod stop
// *** Begin using MongoDB
// $ mongo


// https://mongoosejs.com/docs/index.html
mongoose.connect(
    'mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true },
    (err) => {
        if (err) throw err;
        console.log('Base de datos hospitalDB puerto 27017: \x1b[32m%s\x1b[0m', 'online');
    });


// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});