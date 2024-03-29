// const GitHubStrategy = require('passport-github').Strategy;
// const passport = require('passport')
//
// passport.use(new GitHubStrategy({
//         clientID: GITHUB_CLIENT_ID,
//         clientSecret: GITHUB_CLIENT_SECRET,
//         callbackURL: "http://localhost:3000/auth/github/callback"
//     },
//     function(accessToken, refreshToken, profile, cb) {
//         User.findOrCreate({ githubId: profile.id }, function (err, user) {
//             return cb(err, user);
//         });
//     }
// ));
//
// app.get('/auth/github',
//     passport.authenticate('github'));
//
// app.get('/auth/github/callback',
//     passport.authenticate('github', { failureRedirect: '/login' }),
//     function(req, res) {
//         // Successful authentication, redirect home.
//         res.redirect('/');
//     });