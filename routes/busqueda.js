// Requires
var express = require('express');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');


// Inicializar variables
var app = express();


// =============================================
// Ruta de busqueda por colección
// =============================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    switch (tabla) {
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex)
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de búsqueda sólo son: usuarios, medicos y hospitales',
                error: { message: 'Tipo de tabla/coleccion no válido' }
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
});


// =============================================
// Ruta de busqueda general
// =============================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    // 1) Una forma de buscar es esta
    // Hospital.find({ nombre: regex }, (err, hospitales) => {
    //     res.status(200).json({
    //         ok: true,
    //         hospitales: hospitales
    //     });
    // });

    // 2) Otra forma de buscar es esta
    // buscarHospitales(busqueda, regex)
    //     .then(hospitales => {
    //         res.status(200).json({
    //             ok: true,
    //             hospitales: hospitales
    //         });
    //     });

    // 3) Otra forma de buscar en paralelo es esta
    Promise
        .all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {
            const [hospitales, medicos, usuarios] = respuestas;
            console.log(hospitales, medicos, usuarios);

            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: usuarios
            });
        });

});


function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {

        // Hospital.find({ nombre: regex }, (err, hospitales) => {
        Hospital
            .find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });

    });
}


function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {

        // Medico.find({ nombre: regex }, (err, medicos) => {
        Medico
            .find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }
            });

    });
}


function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {

        // Para el usuario buscaremos sobre el nombre o el email
        Usuario
            .find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });

    });
}


// Para que se pueda usar desde afuera exportamos app
module.exports = app;