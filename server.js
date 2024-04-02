import express from 'express';
const app = express();
const PORT = process.env.PORT || 4000;


const handleGet = function( request, response ) {

}
const handlePost = function( request, response ) {

}

app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
})
