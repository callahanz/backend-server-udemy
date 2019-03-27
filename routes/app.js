// Requires
var express = require('express');


// Inicializar variables
var app = express();


// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
});


// Para que se pueda usar desde afuera exportamos app
module.exports = app;