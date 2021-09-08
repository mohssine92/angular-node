const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

// Crear un nuevo usuario
router.post( '/new', [ // manejador de la ruta , arreglo de midlrs , express validator : todos los mdlrs que debe pasar la peticion antes de ejecutar el controlador 
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(), // tambien es required con isemail 
    check('password', 'La contraseña es obligatoria').isLength({ min: 6 }), // isStrongPassword - investigar que tipo de condiciones estan implementan do
    validarCampos
], crearUsuario ); // cuandos se pasa por mdlr de chack() re request tenemos nuevo objet acumula los err de fallas de validacion por este ultimo 

// Login de usuario
router.post( '/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({ min: 6 }),
    validarCampos
], loginUsuario );

// Validar y revalidar token si jwt sigue siendo vigente  
router.get( '/renew', validarJWT , revalidarToken );







module.exports = router;
// aqui van todas rutas que tengan que ver con autenticacion 