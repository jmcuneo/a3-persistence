const
  express = require('express'),
  greenlock = require('greenlock-express'),
  passport = require('passport'),
  passport_github = require('passport-github2'),
  handlebars = require('express-handlebars'),
  compression = require('compression'),
  minify = require('express-minify'),
  isolation = require('./isolation'),
  database = require('./database'),
  sass = require('./sass'),
  app = express(),
  port = 3000,
  DEBUG = false,
  CALLBACK_DOMAIN = "game.gamestream.stream";

// make css files
sass

// compress

app.use(compression());
app.use(minify());

// setup database and sesions

database.set_up_db_store(app)

// setup Handlebars

const hbs = handlebars.create();

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './hbs');

// setup Passport

passport.use(new passport_github.Strategy({
  clientID: process.env.GITHUB_CLIENT,
  clientSecret: process.env.GITHUB_SECRET,
  callbackURL: `http://${CALLBACK_DOMAIN}/auth/login/callback`
},
  function (accessToken, refreshToken, profile, done) {
    database.DB.findOne({ user_id: profile.id }).then((user) => {
      let is_new = false;
      if (user == null) {
        user = {
          user_id: profile.id,
          username: profile.username,
          equations: {}
        };
        database.DB.insertOne(user);
        is_new=true;
      }
      done(null, { id: profile.id, is_new });

    }).catch((err) => {
      console.log(err);
      done(null, null);
    });
  }
));


app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, cb) => cb(null, user.id));

passport.deserializeUser((id, cb) => cb(null, { id }));

app.use(express.json());

// setup passport urls

app.post('/auth/login',
  passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/login/callback',
  passport.authenticate('github', { failureRedirect: '/failed' }),
  function (req, res) {
    if (req.user.is_new) {
      res.redirect('/created');
    } else {
      res.redirect('/success');
    }
  });



app.post("/auth/logout", (req, res) => {
  req.logout(function (err) {
    res.redirect('/logout');
  })
});

// setup login

function login_page(smallMess, message) {
  return (req, res) => {
    res.render('login', { message, smallMess, layout: false });
  }
}

app.get("/created", login_page("Account Success", "A new account has been made. Redirecting..."));
app.get("/success", login_page("Login Success", "You have been logged in. Redirecting..."));
app.get("/failed", login_page("Login Failed", "Login failed. Redirecting..."));
app.get("/logout", login_page("Logged Out", "You have been logged out. Redirecting..."));


// setup posts

app.post('/', (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).send()
  } else {
    try {
      isolation.evaluate(req.user.id, req.body.name ?? "", req.body.code ?? "").then((equations) => {
        if (equations == null) {
          req.logout(()=> res.status(401).send());
          return;
        }
        res.writeHead(200, "OK", { "Content-Type": "application/json" });
        let json = Object.entries(equations).map(e => ({ name: e[0], code: e[1].code, result: e[1].result }))
        res.end(JSON.stringify(json));
      }).catch(e => {
        res.writeHead(404);
        res.end("script failed to run");
      });
    } catch (e) {
      res.writeHead(404);
      res.end("oh noes");
    }
  }
});

app.use(express.static('public'));

// Run

if (DEBUG) {
  app.listen(process.env.PORT || port)
} else {
  greenlock.init({
    packageRoot: __dirname,
    configDir: './greenlock.d',
    maintainerEmail: "nateguana@gmail.com",
    cluster: false
  }).serve(app);
}
