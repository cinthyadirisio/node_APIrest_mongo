const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    titulo:{
        type: String,
        required: true
      },
    autor: {
        type: String,
        required: true
      },
    generos: {
        type: [String],
        required: true
      },
    cover: {
        type: String,
        required: true
      },
    sinopsis: {
        type: String,
        required: true
      },
      epub: {
        type: String
      },
      pdf: {
        type: String
      }
})

module.exports = mongoose.model('Book', bookSchema)