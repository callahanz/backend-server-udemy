// Requires
var express = require('express');
var path = require('path');
var fs = require('fs');


// Inicializar variables
var app = express();


// Rutas
app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImagen = path.resolve(__dirname, `../uploads/${ tipo }/${ img }`);

    if (fs.existsSync(pathImagen)) {
        // res.download(pathImagen);
        res.sendFile(pathImagen);
    } else {
        var pathNoImagen = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImagen);
    }

});


// Para que se pueda usar desde afuera exportamos app
module.exports = app;