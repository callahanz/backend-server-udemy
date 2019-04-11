// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Importar Rutas
var appRoutes = require('./routes/app');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var usuarioRoutes = require('./routes/usuario');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');
var loginRoutes = require('./routes/login');


// Inicializar variables
var app = express();


// Body Parser
// transforma los parametros de la request en un objeto body
// app usa un parser para application/x-www-form-urlencoded
// app usa un parser para application/json
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


// Server index config
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'));
// app.use('/uploads', serveIndex(__dirname + '/uploads'));


// Rutas
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});