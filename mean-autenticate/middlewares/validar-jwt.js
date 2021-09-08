const { response } = require('express');
const jwt = require('jsonwebtoken');


const validarJWT = ( req, res = response, next ) => { // arg que debe recibir en mdlr

    const token = req.header('x-token');

    if( !token  ) {
        return res.status(401).json({
            ok: false,
            msg: 'error en el token'
        });
    }

    try {

        const { uid, name } = jwt.verify( token, process.env.SECRET_JWT_SEED ); // se verifica contra la firma 
        // si logra verificar voy a obtener un objeto lo cual tiene payload
        // anexar al objet request 
        req.uid  = uid;
        req.name = name;

        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }



    // TODO OK!
    next();
}


module.exports = {
    validarJWT
}

/* 
  imaginamos que tenemos muchos servicios en nuestro backend  que requieren validacion de token , requieren autenticacion correcta para procesar algo . 
  esto o que denominamos mdlrs perzonalizados 
  - asi si una ruta requiere .... le mando la validacion como  mdlr y se cabo el asunto 
  */