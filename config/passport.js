// const GitHubStrategy = require('passport-github').Strategy;
// const mongoose = require('mongoose')
// const User = require('../models/User')


// module.exports = function (passport){
//     //github
//     passport.use(new GitHubStrategy({
//             clientID: process.env.GITHUB_ID,
//             clientSecret: process.env.GITHUB_SECRET,
//             callbackURL: "/auth/github/callback"
//         },
//         async function(accessToken, refreshToken, profile, cb) {
//             console.log(profile)
//             process.env.accessToken = accessToken
//             process.env.profile = profile
//             //cb(null, profile)
//             //for mongodb
//             const newUser = {
//                 githubId: profile.id,
//                 displayName: profile.username
//             }
//             try{
//                 let user = await User.findOne({githubId: profile.id})
//                 if(user){
//                     cb(null, user)
//                 } else{
//                     user = await User.create(newUser)
//                     cb(null, user)
//                 }
//             } catch (err){
//                 console.error(err)
//             }
//             // User.findOrCreate({ githubId: profile.id }, function (err, user) {
//             //     return cb(err, user);
//             // });
//         }
//     ));

//     //for sessions
//     passport.serializeUser(function (user,cb){
//         cb(null, user.id)
//     })

//     passport.deserializeUser(function (id,cb){
//         cb(null, id)
//     })

//     // passport.deserializeUser(async function(id, cb) {
//     //     try {
//     //         const user = await User.findById(id, (err, user) => done(err, user));
//     //         cb(null, user);
//     //     } catch (err) {
//     //         cb(err);
//     //     }
//     // });
//     // passport.deserializeUser((id) => {
//     //     return User.findById(id)
//     //         .then(user => user)
//     //         .catch(err => err);
//     // });


// }








// // app.get('/auth/github',
// //     passport.authenticate('github'));
// //
// // app.get('/auth/github/callback',
// //     passport.authenticate('github', { failureRedirect: '/login' }), //failure, redirect to login
// //     function(req, res) {
// //         // Successful authentication, redirect home.
// //         res.redirect('/');
// //     });

const passport = require("passport");
const User = require("../models/User");
const GitHubStrategy = require("passport-github").Strategy;

const GITHUB_CLIENT_ID = process.env.GITHUB_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_SECRET;


passport.serializeUser(async (user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findOne({_id: id})
    return done(null, user)
});

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
            
      let user = await User.findOne({ githubId: profile.id});
      if (user) return done(null, user);
      else {
        user = await User.create(newUser);
       return done(null, user);
      }
      
    }
  )
);

module.exports = passport;