const express = require('express')
const router = express.Router()
const passport = require('passport')


router.get('/github', passport.authenticate('github', {scope: ['profile']}))


router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/' }),
    function(req, res) {
        // Successful authentication, redirect home.
        req.session.accessToken = process.env.accessToken
        res.redirect('/dashboard')
    }
    )

router.get('/logout', (req, res, next) =>{
    req.logout(function(err) {
        if (err) { return next(err) }
        res.redirect('/')
    })
})

module.exports = router