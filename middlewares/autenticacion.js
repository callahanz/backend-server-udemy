var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;


// ==================================
// Verificar token
// (los token es mejor enviarlos en un header en lugar de por url)
// (se podria usar un interceptor para no tener que comprobar en cada petición)
// (se pueden hacer las exportaciones de varias formas, la que usamos aqui es otra manera de hacerlo)
// ==================================
exports.verificaToken = function(req, res, next) {
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        // res.status(200).json({
        //     ok: true,
        //     decoded: decoded
        // });

        // queremos que la informacion del usuario este disponible en cualquier petición
        req.usuario = decoded.usuario;

        // Puede continuar con las demas funciones
        next();

    });
}

// app.use('/', (req, res, next) => {});