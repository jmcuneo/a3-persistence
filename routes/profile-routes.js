const router = require('express').Router();


router.get('/', (req, res) => {
    res.send(`hello ` + req.user);
})

module.exports = router;