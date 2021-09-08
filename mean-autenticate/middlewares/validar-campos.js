const { response } = require('express');
const { validationResult } = require('express-validator'); // funcion me saca objeto de errs accumulados 



const validarCampos = (req, res = response, next ) => {
    
    const errors = validationResult( req );
    if ( !errors.isEmpty() ) {
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
            
        });
    }

    next(); // avanze el proceso siguiente 
}


module.exports = {
    validarCampos
}

/* 
 la idea es cuando aplicamos mdlr ed express validator , se acumulan los err en object request en caso de existir
 ver docs en npms de express validator para mas ejemplos
*/ 
