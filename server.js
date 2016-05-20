const http = require('http');
const url = require('url');
var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require("mongoose"));
const hostname = '127.0.0.1';
const port = 3000;

mongoose.connect('mongodb://mongo:27017/questions', function (err, res) {
  if (err) {
    console.log('ERROR connecting to mongo db');
  } else {
    console.log('Successfully connected to mongo');
  }
});

var questionSchema = mongoose.Schema({
  title: String,
  body: String,
});
var Question = mongoose.model('Question', questionSchema);


const server = http.createServer((req, res) => {
  createResponse(req, res);
});

server.listen({'port': 3000}, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function createResponse(req, res) {
  var req_url = url.parse(req.url, true);
  
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.statusCode = 200;

  if (req_url['pathname'] == "/add") {
    addQuestion(req_url['query']).then(function(response) {
      // done
    }).catch(function(e) {
      res.write("Error saving data!\n");
    });
  }
  viewQuestions().then(function(response) {
    res.end(response);
  });
}

function addQuestion(params) {
  var question = new Question(params);
  
  return question.save().then(function (que) {
    return "saved!";
  });
}

function viewQuestions() {
  return Question.find().exec().then( function(questions) {
    return JSON.stringify(questions, undefined, 2);
  });
}
