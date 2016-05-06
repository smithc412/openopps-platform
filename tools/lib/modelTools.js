var _ = require('lodash');
var fs = require('fs');
var parse = require('csv-parse/lib/sync');
var Converter = require("csvtojson").Converter;
var EmailAddr = require("email-addresses");

module.exports = {
  importFromFile: function(model, filepath, transform) {
    if (!fs.existsSync(filepath)) {
      throw new Error("File Not Found: '" + filepath + "'");
    }
    console.log("importing:", filepath);
    var converter = new Converter({});
    if (transform) converter.transform = transform;
    return new Promise(function(resolve, reject) {
      converter.on("end_parsed", function (attrList) {
        console.log('end_parsed', attrList);
        return resolve(model.create(attrList));
      });
      converter.on("error", reject);
      require("fs").createReadStream(filepath).pipe(converter);
    });

  },
  createUsersFromEmailList: function(filepath) {
    // assume email is first.last@agency.gov
    if (!fs.existsSync(filepath)) {
      throw new Error("File Not Found: '" + filepath + "'");
    }
    input = fs.readFileSync(filepath, {encoding: 'utf8'});
    var emails = input.split("\n");
    emails = _.reject(emails, function(email) { return email === ''});
    var attrList = _.map(emails, function(email) { return {username: email}})
    var foundUsers;
    var promise =
    User.find(attrList)
    .then(function(users) {
      foundUsers = users;
      foundEmails = _.map(users, function(u) { return u.username });
      console.log('==> foundEmails', foundEmails);
      _.forEach(foundEmails, function(email) {
        var index = emails.indexOf(email);
        if (index !== -1) emails.splice(index, 1);
      });
      var attrList = _.map(emails, function(email) {
        var parts = EmailAddr.parseOneAddress(email);
        if (!parts.name) {
          parts.name = parts.local.split('.').join(' ');
        }
        return { username: parts.address,
                 name: parts.name }
      });
      console.log('==> users to create:', attrList);
      return User.create(attrList)
    })
    .then(function(users) {
      console.log('=======> created:', users);
    })
    return promise;
  },
  importTasksFromFile: function(filepath) {
    console.log("importing:", filepath);
    if (fs.existsSync(filepath)) {
      input = fs.readFileSync(filepath);
      var attrList = parse(input, {columns: true});
      var date = new Date();
      return Task.create(attrList);
    } else {
      var msg = "File Not Found: '" + filepath + "'"
      console.log(msg)
      throw new Error(msg);
    }
  }
}
