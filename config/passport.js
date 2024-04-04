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
    new GitHubStrategy( //GitHub strategy implementation
        {
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: "/auth/github/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            const newUser = {
                githubId: profile.id,
                displayName: profile.username,
                githubUrl: profile.profileUrl
            }
            let user = await User.findOne({githubId: profile.id});
            if (user) return done(null, user);
            else {
                user = await User.create(newUser); //create user if not exists
                return done(null, user);
            }

        }
    )
);

module.exports = passport;