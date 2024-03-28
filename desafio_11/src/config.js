const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const User = require('./models/user');
const bcrypt = require('bcrypt');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
          user = new User({
            githubId: profile.id,
            username: profile.username,
            email: profile.emails[0].value,
          });
        }

        // Encriptar la contraseña antes de guardarla
        if (profile.password) {
          const hashedPassword = await bcrypt.hash(profile.password, 10); // Hash con salt de 10 rondas
          user.password = hashedPassword;
        }

        await user.save();

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
