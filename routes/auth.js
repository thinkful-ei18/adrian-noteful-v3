'use strict';

const options = {session: false, failwithError: true};

const localAuth = passport.authenticate('local', options);

passport.use(localStrategy);
const localAuth = passport.authenticate('local', { session: false });

app.post('/api/secret'), localAuth, function (req, res) {
  console.log(`${req.user.username} successfully logged in.`);
  res.json({
    message: 'never forget!',
    username: req.user.username
  });
};