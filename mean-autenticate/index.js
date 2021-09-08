const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./db/config');
const path = require('path')
/* 
  va tomar configuracion por defecto y leer el archivo de .env asi añade las variables configuradas en el mismo al objeto process.env 
*/
require('dotenv').config();

// Crear el servidor/aplicación de express
const app = express();

// Base de datos - connect this app node with mongodb atlass
dbConnection();


// sirve ruta statica en recibir url base
app.use( express.static('public') );


// CORS 363
/* postman tiene cosas que se saltan el corse , cuando lo hagsmos desde otro deminio de app de angular o similares alli google crome me va advertir que mi hosting no esta configurado 
   con el corse o peticiones de cross domain no son permitidas */
app.use( cors() );

// Lectura y parseo del body : lo conoce como transformar lo que viene en el body
app.use( express.json() );


// Rutas - relacion router con servidor express usando mdlr de express use()
app.use( '/api/auth', require('./routes/auth') );


// si no encuentra ruta en servidor de express sirva el siguiente path - asi caemos en router de angular  
// se puede resolver con hash por parte de angular pero no es buen opcion 
app.get('*', (req, res) =>{ 
   
   res.sendFile( path.resolve(__dirname, 'public/index.html'))
})


app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
});


