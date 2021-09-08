const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs')
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async(req, res = response) => { // respone tipado para ayuda

    const { email, name, password } = req.body;



    try {
        // Verificar el email que no exista porque es unico en la eschema del modelo
        const usuario = await Usuario.findOne({ email });

        if ( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese email'
            });
        }

        // Crear usuario con el modelo  // let es variable puedo camiar a lo que apunta 
        const dbUser = new Usuario( req.body );

        // Hashear la contraseña
        const salt = bcryptjs.genSaltSync();
        dbUser.password = bcryptjs.hashSync( password, salt );

       
        // Generar el JWT lo cual mandemos a angular paraque lo utulize como metodo de autenticacion pasiva - verificar si el user esta autenticado o no 
        const token = await generarJWT( dbUser._id, name );

        // Crear usuario de DB
        await dbUser.save();

        // Generar respuesta exitosa
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name,
            email,
            token
        });

    

        
    } catch (error) {
        console.log(error); // mis errs de programacion 
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador' // aqui no mande este tipo de err lo va a ver cualquiera 
        });
    }

}


const loginUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    
    try {
        
        const dbUser = await Usuario.findOne({ email });

        if( !dbUser ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            });
        }

        // Confirmar si el password hace match
        const validPassword = bcryptjs.compareSync( password, dbUser.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'El password no es válido'
            });
        }

        // Generar el JWT
        const token = await generarJWT( dbUser.id, dbUser.name );

        // este es el punto donde podemos grabar cual es el ultimoa acceso que ha tenido la persona etc etc ..

        // Respuesta del servicio
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email,
            token
        });



    } catch (error) {
        console.log(error);

        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const revalidarToken = async(req, res = response ) => {

    const { uid } = req; // desetructura la anexacion

    // Generar el JWT nuevo alargar la vida de la autenticacion - siempre genera new token with vigencia  de 24h
    
    const token = await generarJWT( uid );
  
    
    /// leer db 
    const dbUser = await Usuario.findById( uid ); // finbyid funciona mas rapido que findfbyon
    const { email , name } = dbUser;  

    return res.json({
        ok: true,
        uid, 
        name,
        email,
        token
    });

}



module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}  // exportacion de nuestros controladores