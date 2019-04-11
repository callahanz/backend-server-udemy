// Requires
var express = require('express');
var Medico = require('../models/medico');

// var jwt = require('jsonwebtoken');
// var SEED = require('../config/config').SEED;
var mdAutenticacion = require('../middlewares/autenticacion');


// Inicializar variables
var app = express();


// Rutas
// ==================================
// Obtener todos los medicos
// ==================================
app.get('/', (req, res, next) => {

    // recuperamos el offset
    var desde = Number(req.query.desde || 0);

    // Medico.find({}, (err, medicos) => {
    // Medico.find({}, 'nombre img usuario hospital', (err, medicos) => {
    Medico
        .find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando medicos',
                    errors: err
                });
            }

            Medico.count({}, (err, conteo) => {

                res.status(200).json({
                    ok: true,
                    medicos: medicos,
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
// Actualizar medico
// ==================================
// app.put('/:id', (req, res) => {
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + ' no existe',
                errors: { message: 'No existe un medico con ese ID' }
            });
        }

        medico.nombre = body.nombre;
        medico.hospital = body.hospital;

        // el usuario esta disponible a traves de la funcion verificaToken que creamos en autentificacion.js
        // medico.usuario = req.usuario._id;
        medico.usuario = req.usuario;

        medico.save((err, medicoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        });

    });

});


// ==================================
// Crear un nuevo medico
// ==================================
// app.post('/', (req, res) => {
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    // esto va a funcionar si tenemos el body-parser instalado
    // que transforma los parametros de la request en un objeto body
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        hospital: body.hospital,
        // el usuario esta disponible a traves de la funcion verificaToken que creamos en autentificacion.js
        // usuario: req.usuario._id
        usuario: req.usuario
    });

    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
            medicotoken: req.medico
        });

    });

});


// ==================================
// Borrar un medico por el id
// ==================================
// app.delete('/:id', (req, res) => {
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con ese id',
                errors: { message: 'No existe un medico con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });

    });

});



// Para que se pueda usar desde afuera exportamos app
module.exports = app;