// Requires
var express = require('express');
var mongoose = require('mongoose');


// Inicializar variables
var app = express();


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
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
});


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});