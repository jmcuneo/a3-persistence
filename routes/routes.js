const express = require('express')
const router = express.Router()
const Data = require('../models/Data')

const isAuth = (req, res, next) =>{
    if(req.user){
        next()
    }
    else{
        res.redirect('/')
    }
}

const isGuest = (req, res, next) =>{
    if(req.user){
        res.redirect('/dashboard')
    } else{
        next()
    }
}

//routes to redirect to user to different pages
router.get('/', isGuest, (req, res) =>{
    res.render('login', {stuff: "This is login page"})
})



router.get('/dashboard', isAuth, async (req, res) => {
    //console.log(req.user)
    // if(req.user){
    //     res.redirect('/dashboard')
    // } else{
    let username = "ssunku6"
    console.log("username = "+req.user.username)
    res.render('dashboard', {name: username})
    // console.log("username = "+req.user.username)
    // res.render('dashboard', {name: req.user.username})

})

router.get('/billingsystem', isAuth, async(req, res) =>{
    let name = "ssunku6"
    let id = "128723424"
    try{
        const billingdata = await Data.find({githubId: id}).lean()
        res.render('billingsystem', {username: name, billingdata: billingdata, id:id})
    } catch(err){
        console.error(err)
        res.render('error')
    }
})

router.get('/instructions', isAuth, (req, res) =>{
    res.render('instructions' )
})

router.post('/add-data', isAuth, async (req, res) => {
    try{
        req.body.user = req.user.id
        await Data.create(req.body)
        res.redirect('/billingsystem')
    } catch (err){
        console.error(err)
        res.render('error')
    }
})

module.exports = router