// Requires
var express = require('express');
var Hospital = require('../models/hospital');

// var jwt = require('jsonwebtoken');
// var SEED = require('../config/config').SEED;
var mdAutenticacion = require('../middlewares/autenticacion');


// Inicializar variables
var app = express();


// Rutas
// ==================================
// Obtener todos los hospitales
// ==================================
app.get('/', (req, res, next) => {

    // recuperamos el offset
    var desde = Number(req.query.desde || 0);

    // Hospital.find({}, 'nombre img usuario', (err, hospitales) => {
    // Hospital.find({}, (err, hospitales) => {
    Hospital
        .find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando hospitales',
                    errors: err
                });
            }

            Hospital.count({}, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    hospitales: hospitales,
                    total: conteo
                });

            });

        });
});


// ==================================
// Verificar token
// (los token es mejor enviarlos en un header en lugar de por url)
// (se podria usar un interceptor para no tener que comprobar en cada petición)
// (en este middleware que estamos construyendo cualquier ruta que se encuentre abajo de esta va a tener que pasar por aqui primero)
// const headers = new HttpHeaders({ 'authentication': 'VALOR'} );
// ==================================
/*app.use('/', (req, res, next) => {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        // Puede continuar con las demas funciones que se encuentran más abajo
        next();

    });
});*/


// ==================================
// Actualizar hospital
// ==================================
// app.put('/:id', (req, res) => {
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }

        hospital.nombre = body.nombre;

        // el usuario esta disponible a traves de la funcion verificaToken que creamos en autentificacion.js
        // hospital.usuario = req.usuario._id;
        hospital.usuario = req.usuario;

        hospital.save((err, hospitalGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });

    });

});


// ==================================
// Crear un nuevo hospital
// ==================================
// app.post('/', (req, res) => {
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    // esto va a funcionar si tenemos el body-parser instalado
    // que transforma los parametros de la request en un objeto body
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        // img: body.img,
        // el usuario esta disponible a traves de la funcion verificaToken que creamos en autentificacion.js
        // usuario: req.usuario._id,
        usuario: req.usuario
    });

    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });

    });

});


// ==================================
// Borrar un hospital por el id
// ==================================
// app.delete('/:id', (req, res) => {
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese id',
                errors: { message: 'No existe un hospital con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });

    });

});



// Para que se pueda usar desde afuera exportamos app
module.exports = app;