var async = require('async');
var casual = require('casual');
var faker = require('faker');
var request = require('superagent');

var password = '123';
var log = false;

var collections = {};

collections['categories'] = [];
collections['articles'] = [];
collections['authors'] = [];

var fakers = {};

fakers['categories'] = function () {
  return {
    name: faker.commerce.product(),
    description: faker.lorem.sentences()
  };
};

fakers['articles'] = function () {
  return {
    title: faker.lorem.sentence(),
    subtitle: faker.lorem.sentences(),
    summary: faker.lorem.paragraph(),
    content: faker.lorem.paragraphs(),
    created_at: faker.date.past(),
    updated_at: faker.date.past(),
    published_at: faker.date.past(),
    tags: faker.lorem.words(),
    author_id: random_id_from(collections.authors),
    category_id: random_id_from(collections.categories)
  };
};

fakers['authors'] = function () {
  return {
    email: faker.internet.email(),
    password: password,
    fullname: faker.name.firstName() + ' ' + faker.name.lastName(),
    location: faker.address.city(),
    birthdate: faker.date.past()
  };
};

function random_id_from (models) {
  var index = faker.random.number({ min: 0, max: models.length-1 });
  var model = models[index];
  var id = model.id;
  return id;
}

function till (n, iterate) {
  return function (next) {
    var count = 0;

    function test () {
      return count < n;
    }

    function step (done) {
      count += 1;
      iterate(done);
    }

    async.whilst(test, step, next);
  }
}

function populate (name) {
  return function (next) {
    var data = fakers[name]();
    var api = 'http://localhost:3000/api/' + name;
    var collection = collections[name];
    request
      .post(api)
      .send(data)
      .type('json')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) {
          callback(err);
          return;
        }
        var model = res.body;
        collections[name].push(model);
        if (log) {
          console.log(name, collections[name].length);
        }
        next(null);
      });
  };
}

function start () {
  async.waterfall([
    till(3, populate('authors')),
    till(6, populate('categories')),
    till(30, populate('articles'))
  ], function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('yeah');
  });
}

start();