const express = require('express')
const router = express.Router()
const Book = require('../models/books.model')

//Middleware
const getBook = async(req, res, next) => {
    let book;
    const { id } = req.params;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        return res.status(404).json({
            message: 'El ID no coincide con ningún libro de la BD'
        })
    }
    try {
        book = await Book.findById(id)
        if(!book){
            return res.status(404).json({
                message: 'El libro no fue encontrado'
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
    res.book = book
    next()
}


router.get('/', async (req, res) => {
    try {
        const books = await Book.find()
        console.log('GET ALL', books)
        if (books.length === 0) return res.status(204).json([])
        res.json(books)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/', async (req, res) => {
    const { titulo, autor, generos, cover, sinopsis, epub, pdf } = req?.body
    if (!titulo || !autor || !generos || !cover || !sinopsis) return res.status(400).json({
        message: 'Los campos titulo, autor, generos, cover y sinopsis son obligatorios'
    })

    const book = new Book({
        titulo, autor, generos, cover, sinopsis, epub, pdf
    })

    try {
        const newBook = await book.save()
        res.status(201).json(newBook)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.get('/:id', getBook, async(req, res) =>{
    res.json(res.book)
})

router.put('/:id', getBook, async(req, res) =>{
    try {
        const book = res.book
        book.titulo = req.body.titulo || book.titulo
        book.autor = req.body.autor || book.autor
        book.generos = req.body.generos || book.generos
        book.cover = req.body.cover || book.cover
        book.sinopsis = req.body.sinopsis || book.sinopsis
        book.epub = req.body.epub || book.epub
        book.pdf = req.body.pdf || book.pdf

        const updatedBook = await book.save()
        res.json(updatedBook)

    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

router.patch('/:id', getBook, async(req, res) =>{
    if (!req.body.titulo || !req.body.autor || !req.body.generos || !req.body.cover || !req.body.sinopsis || !req.body.epub || !req.body.pdf){
        res.status(400).json({
            message: 'Debes mandar al menos un campo para realizar un cambio'
        })
    }
    
    try {
        const book = res.book
        book.titulo = req.body.titulo || book.titulo
        book.autor = req.body.autor || book.autor
        book.generos = req.body.generos || book.generos
        book.cover = req.body.cover || book.cover
        book.sinopsis = req.body.sinopsis || book.sinopsis
        book.epub = req.body.epub || book.epub
        book.pdf = req.body.pdf || book.pdf

        const updatedBook = await book.save()
        res.json(updatedBook)

    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

router.get('/:id', getBook, async(req, res) =>{
    try {
        const book = res.book
        await book.deleteOne({
            _id: book._id
        })
        res.json({
            message: `El libro ${book.titulo} ha sido borrado`
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

module.exports = router