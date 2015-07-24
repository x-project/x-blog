module.exports = function (BaseUser) {

  BaseUser.afterRemote('create', function(context, user, next) {

    console.log('create', user);

    // BaseUser.app.models.Email.send({
    //   to: user.email,
    //   from: 'test@example.com',
    //   subject: 'Hello!',
    //   text: 'my text',
    //   html: 'my <em>html</em>'
    // }, function(err, mail) {
    //   if (err) {
    //     console.log(err);
    //     return;
    //   }
    //   console.log('email sent!');
    //   next();
    // });

  });

};