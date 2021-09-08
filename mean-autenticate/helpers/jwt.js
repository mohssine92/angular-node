const jwt = require('jsonwebtoken');


const generarJWT = ( uid, name ) => {

    const payload = { uid, name };
    
    return new Promise( (resolve, reject) => {

        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '24h' // pude defir de hora , años , dias etc .. ver docs official 
        }, (err, token) => {
    
            if ( err ) {
                // TODO MAL
                console.log(err);
                reject(err);
    
            } else {
                // TODO BIEN
                resolve( token ) // token generado con vigencia de 24h 
            }
    
        })//sign() regresa un callback , yo estoy trabajando con asyn await en mi controller , asi la voy a transaformar a una promresa y para poder implemenar resolver and reject y asyn await


    });




}


module.exports = {
    generarJWT
}
/* jamas mandar info sensible como del banco dentro de jwt se puede leer por parte del cliente 
   el secreto aqui en autenticacion es la firma . la fabrica de jwt dispara payload con su firma , esi en la verificacion del mismo 
   si el payload de dicha firma se ha cambiado se rechaza la autenticacion 
*/