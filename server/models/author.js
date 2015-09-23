var loopback = require('loopback');

module.exports = function (Author) {

  function getCurrentUserId() {
    var ctx = loopback.getCurrentContext();
    var accessToken = ctx && ctx.get('accessToken');
    var userId = accessToken && accessToken.userId;
    return userId;
  }

  Author.change_email = function (new_email, confirm_email, cb) {
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

      user.updateAttribute('email', new_email, function (err, user) {
        if (err) {
          cb(err, null);
          return;
        }

        cb(null, true);
      });
    });

  };
   
  Author.remoteMethod('change_email', {
    http: { path: '/change_email', verb: 'post' },
    accepts: [
      { arg: 'new_email', type: 'string' },
      { arg: 'confirm_email', type: 'string' }
    ],
    returns: { arg: 'changed', type: 'boolean' }
  });

};