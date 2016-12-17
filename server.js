var express = require ('express');
var app = express();
var mongoose = require ('mongoose');
var morgan = require ('morgan');
var bodyParser = require ('body-parser');
var methodOverride = require ('method-override');

// configuration
mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io

app.use(express.static(__dirname = '/public')); // set the static file structure
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); //parse application/x-form-urlencoded
app.use(bodyParser.json()); //parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); //parse application/vnd.api+json as json

var Todo = mongoose.model('Todo', {
  text: String
});


// listen (start app with node server.js)
app.listen(3000);
console.log("App listening on port 3000");

// routes

//api
// get all todos

app.get('/api/todos', function(req, res) {

  //use mongoose to get all todos in the database
  Todo.find(function(err, todos){
    if (err)
      res.send(err)

    res.json(todos); // return all todos in JSON format

  });
});

// create todo and send back all todos after creation

app.post('/api/todos', function(req, res) {

    // create a todo, information comes form AJAX request from Angular
    Todo.create({
      text:req.body.text,
      done: false
    }, function(err, todo) {
      if (err)

        res.send(err);

        // get and return all the todos after you create another
        Todo.find(function(err, todo) {
          if (err)

            res.send(err)

          res.json(todo);

      });

    });
});

// application
app.get('*', function(req, res) {
  res.sendfile('./public/index.html'); // load the single view file
});
