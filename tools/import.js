var Promise = require('bluebird');

var Sails = require('sails').constructor;
var sailsApp = new Sails();

var dbTools = require('./lib/dbTools');
var sailsModel = require('./lib/modelTools');
var sailsLift = Promise.promisify(sailsApp.lift, {context: sailsApp});

dbTools.checkTableSetup('midas_user')
.then(function() {
  return sailsLift({
      log: {
        level: 'error'
      },
      emailProtocol: ''
    });
})
.then(function(liftedApp) {
  console.log('config connections:', liftedApp.config.connections);
  console.log('config models.connection:', liftedApp.config.models.connection);
  //var datapath = __dirname + '/import/usernames.txt';
  var datapath = __dirname + '/import/somenames.txt';
  return sailsModel.createUsersFromEmailList(datapath);
})
.then(function(users) {
  //var datapath = __dirname + '/import/gsa-opps.csv'
  var datapath = __dirname + '/import/quick.csv'
  var taskModel = sails.models['task'];
  return sailsModel.importFromFile(taskModel, datapath, function(json,row,index) {
    var sourceProperties = [];
    for (var k in json) sourceProperties.push(k);

    console.log('input',json);

    if (json['Timestamp'] !== '') {
      console.log(' ---> processing')
      json.publishedAt = new Date(json['Timestamp']);
      json.title = json['Opportunity Title'];
      json.description = json['Objectives/ Expectations'];
      if (json.description !== '') json.description += "\n"
      json.description += json['Description of Duties']
      json.state = "open";
      json.userId = 1;
    } else {
      console.log(' ---> no Timestamp, skippig row', index);
    }
    for (var index in sourceProperties) {
      prop = sourceProperties[index];
      delete json[prop];
    }
    console.log('result',json);
  });
})
.then(function(tasks) {
  console.log('new tasks created: ', tasks);
  console.log("Sails app lifted successfully: http://localhost:"+sailsApp.config.port);
})
.catch(function(err) {
  console.log('unexpected error: ', err)
});
