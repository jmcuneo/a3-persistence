const router = require("express").Router(); //create instnce of route
const passport = require('passport');
//auth login
router.get('/login', (req, res) =>{
    res.render('login')
})

router.get('/github', passport.authenticate('github', {
    scope: ['profile']
}));


//callback route for github -> tell passport to give us the profile info from the code
router.get('/github/redirect', passport.authenticate('github'), (req, res) => {
    //res.send(req.user);
    res.redirect('/profile/');
});


module.exports = router;