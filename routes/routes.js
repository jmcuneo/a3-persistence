const express = require('express')
const router = express.Router()

const isAuth = (req, res, next) =>{
    if(req.user){
        next()
    }
    else{
        res.redirect('/login')
    }
}

//routes to redirect to user to different pages
router.get('/login', isAuth, (req, res) =>{
    res.render('login', {stuff: "This is login page"})
})

router.get('/logout', isAuth, (req, res) =>{
    req.logOut()
    res.redirect('/login')
})

router.get('/',  (req, res) => {
    console.log(req.user)
    if(req.user){
        res.redirect('/')
    }
    res.render('dashboard', {things: "This is dashboard page"})
})

module.exports = router