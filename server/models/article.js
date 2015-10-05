module.exports = function (Article) {

  Article.observe('before save', function (ctx, next) {
    var date = (new Date()).toISOString();
    if (ctx.instance) {
      ctx.instance.updated_at = date;
    } else {
      ctx.data.created_at = date;
      ctx.data.updated_at = date;
    }
    next();
  });

};