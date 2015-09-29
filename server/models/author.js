var loopback = require('loopback');

module.exports = function (Author) {

  function getCurrentUserId() {
    var ctx = loopback.getCurrentContext();
    var accessToken = ctx && ctx.get('accessToken');
    var userId = accessToken && accessToken.userId;
    return userId;
  }

  Author.change_email = function (new_email, confirm_email, password, cb) {
    if (new_email !== confirm_email) {
      cb({ error: 'email not confirmed' }, null);
      return;
    }

    var userId = getCurrentUserId();  

    Author.findById(userId, function (err, user) {
      if (err) {
        cb(err, null);
        return;
      }

      user.hasPassword(password, function (err, match) {
        if (!match) {
          cb({ error: 'invalid password' }, null);
          return;
        }

        user.updateAttribute('email', new_email, function (err, user) {
          if (err) {
            cb(err, null);
            return;
          }

          cb(null, true);
        });

      });       

    });

  };
   
  Author.remoteMethod('change_email', {
    http: { path: '/change_email', verb: 'post' },
    accepts: [
      { arg: 'new_email', type: 'string' },
      { arg: 'confirm_email', type: 'string' },
      { arg: 'password', type: 'string' }
    ],
    returns: { arg: 'changed', type: 'boolean' }
  });

  Author.change_password = function (new_password, confirm_password, password, cb) {
    if (new_password !== confirm_password) {
      cb({ error: 'password not confirmed' }, null);
      return;
    }

    var userId = getCurrentUserId();  

    Author.findById(userId, function (err, user) {
      if (err) {
        cb(err, null);
        return;
      }

      user.hasPassword(password, function (err, match) {
        if (!match) {
          cb({ error: 'invalid password' }, null);
          return;
        }

        user.updateAttribute('password', new_password, function (err, user) {
          if (err) {
            cb(err, null);
            return;
          }

          cb(null, true);
        });

      });       

    });

  };
   
  Author.remoteMethod('change_password', {
    http: { path: '/change_password', verb: 'post' },
    accepts: [
      { arg: 'new_password', type: 'string' },
      { arg: 'confirm_password', type: 'string' },
      { arg: 'password', type: 'string' }
    ],
    returns: { arg: 'changed', type: 'boolean' }
  });


  // Author.change_password = function (new_password, confirm_password, password cb) {
  //   if (new_password !== confirm_password) {
  //     cb({ error: 'password not confirmed' }, null);
  //     return;
  //   }

  //   var userId = getCurrentUserId(); 
  //   console.log(userId) 

  //   Author.findById(userId, function (err, user) {
  //     if (err) {
  //       cb(err, null);
  //       return;
  //     }

  //     user.updateAttribute('password', new_password, function (err, user) {
  //       if (err) {
  //         cb(err, null);
  //         return;
  //       }

  //       cb(null, true);
  //     });
  //   });

  // };
   
  // Author.remoteMethod('change_password', {
  //   http: { path: '/change_password', verb: 'post' },
  //   accepts: [
  //     { arg: 'new_password', type: 'string' },
  //     { arg: 'confirm_password', type: 'string' }
  //   ],
  //   returns: { arg: 'changed', type: 'boolean' }
  // });


  Author.on('resetPasswordRequest', function (info) {
  console.log(info);
  //   console.log(info.email); // the email of the requested user
  //   console.log(info.accessToken); // the temp access token to allow password reset
  //   console.log(info.user);

  //   //TODO: send email to user
   });

};