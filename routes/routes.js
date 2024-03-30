const express = require('express')
const router = express.Router()
const Data = require('../models/Data')
const {cache} = require("express/lib/application");

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
    console.log(req.user)
    // if(req.user){
    //     res.redirect('/dashboard')
    // } else{
    let username = "ssunku6"
    console.log("username = "+req.user.username)
    //console.log("username = "+req.user.username)
    res.render('dashboard', {name: username})

    // res.render('dashboard', {name: req.user.username})

})

router.get('/billingsystem', isAuth, async(req, res) =>{
    let name = "ssunku6"
    let id = "128723424"
    try{
        const billingdata = await Data.find({githubId: id}).lean()
        // res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
        // res.set('Pragma', 'no-cache')
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

router.put('/update_data', isAuth, async (req, res) =>{
    //console.log("updated data: ",req.body)
    let data = await Data.findOneAndUpdate({_id: req.body._id}, req.body, {
        runValidators: true
    })
    res.redirect('/billingsystem')
})

router.delete('/delete_data', isAuth, async (req, res) => {
    console.log("id to be deleted: ")
    console.log(req.body._id)
    try{
        await Data.deleteOne({_id: req.body._id})
        // let name = "ssunku6"
        // let id = "128723424"
        // const billingdata = await Data.find({githubId: id}).lean()
        // res.render('billingsystem', {username: name, billingdata: billingdata, id:id})
        res.redirect('/billingsystem')

    } catch (err){
        console.error(err)
        res.render('error')
    }
})

module.exports = router