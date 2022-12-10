//studentserver.js

const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const fs = require('fs');
const glob = require("glob")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('./public/'));

/**
 * POST Function
 * Creates a unique record ID using current date and time and takes in fields from the body
 * of the HTTP POST request, the values are assigned to object variables and then stringified
 * to be written to a JSON file stored in the /students directory
 */
app.post('/students', function(req, res) {
  var record_id = new Date().getTime();

  var obj = {};
  obj.record_id = record_id;
  obj.first_name = req.body.first_name;
  obj.last_name = req.body.last_name;
  obj.gpa = req.body.gpa;
  obj.enrolled = req.body.enrolled;

  var str = JSON.stringify(obj, null, 2);
  console.log("POST | JSON: " + str);

  fs.writeFile("students/" + record_id + ".json", str, function(err) {
    var rsp_obj = {};
    if(err) {
      rsp_obj.record_id = -1;
      rsp_obj.message = 'error - unable to create resource';
      return res.status(200).send(rsp_obj);
    } else {
      rsp_obj.record_id = record_id;
      rsp_obj.message = 'successfully created';
      return res.status(201).send(rsp_obj);
    }
  }); //end writeFile method
  
}); //end post method

/**
 * GET Function (by ID)
 * Takes in a GET parameter provided by the HTTP request, the parameter is treated as a record ID
 * and is then used to search the file names of each JSON file stored in /students directory, if a 
 * file with a matching file name is found, it is sent as a response, otherwise a 404 error is returned
 */
app.get('/students/:record_id', function(req, res) {
  console.log("Searching by record ID...");
  var record_id = req.params.record_id;
  console.log("GET | Query: http://localhost:5678/students/" + record_id);

  fs.readFile("students/" + record_id + ".json", "utf8", function(err, data) {
    if (err) {
      var rsp_obj = {};
      rsp_obj.record_id = record_id;
      rsp_obj.message = 'error - resource not found';
      return res.status(404).send(rsp_obj);
    } else {
      return res.status(200).send(data);
    }
  });
});

/**
 * GET Function (by name)
 * Takes a GET request from a different route that includes HTML query parameters. THe parameters are accessed
 * and used as search values to be used in the searchFiles() function.
 */
app.get('/search', function(req, res) {
  console.log("Searching by record Last Name...");
  var obj = {};
  var arr = [];
  filesread = 0;
  var last_name = req.query.last_name;//get query data
  console.log("GET | Query: http://localhost:5678/search?lastname=" + last_name);
  glob("students/*.json", null, function (err, files) {
    if (err) {
      return res.status(500).send({"message":"error - internal server error"});
    }
    searchFiles(files,[],res,last_name);
  });
})

/**
 * readFiles(files,arr,res)
 * Takes in ambiguous "files", "arr" amd "res" arguments and uses them to step through each JSON file stored
 * in \students directory and stores the contents to an array of JSON objects, once done, the arr and sent out
 * as a server response.
 */
function readFiles(files,arr,res) {
  fname = files.pop();
  if (!fname)
    return;
  fs.readFile(fname, "utf8", function(err, data) {
    if (err) {
      return res.status(500).send({"message":"error - internal server error"});
    } else {
      arr.push(JSON.parse(data));
      if (files.length == 0) {
        var obj = {};
        obj.students = arr;
        return res.status(200).send(obj);
      } else {
        readFiles(files,arr,res);
      }
    }
  });  
}

/**
 * searchFiles(files,arr,res,key)
 * Almost identical to the readFiles() function, except this take in a 4th argument "key" which is the search
 * term used to filter each file in the \students directory. as each file is read, the function will compare 
 * the last_name attribute of the JSON to the key, if they match, it is added to the response array, once all
 * the files are checked, the reponse array is sent as the server response
 * TODO: include first_name parameter for filtering and add duplicate tracking
 */
function searchFiles(files,arr,res,key) {
  fname = files.pop();
  console.log("Checking " + fname + " file for a matching last_name to " + key);
  if (!fname)
    return;
  fs.readFile(fname, "utf8", function(err, data) {
    if (err) {
      return res.status(500).send({"message":"error - internal server error"});
    } else {
      if (JSON.parse(data).last_name == key) {
        console.log("Key: " + key + " | MATCH FOUND!");
        arr.push(JSON.parse(data));
      }
      if (files.length == 0) {
        var obj = {};
        obj.students = arr;
        return res.status(200).send(obj);
      } else {
        searchFiles(files,arr,res,key);
      }
      }
  });  
}

/**
 * GET Function
 * Takes a GET request with no parameters and returns all available stored JSON
 * entries by using the readFiles() function
 */
 app.get('/students', function(req, res) {
  var obj = {};
  var arr = [];
  filesread = 0;

  console.log("GET | Returns all available student .json files");

  glob("students/*.json", null, function (err, files) {
    if (err) {
      return res.status(500).send({"message":"error - internal server error"});
    }
    readFiles(files,[],res);
  });

});

/**
 * PUT Function
 * Takes a PUT request with a parameter of the record ID and the body of a new JSON object,
 * the new JSON is stringified and prepped to be inserted. The function then checks to see if
 * there's an existing record with a matching ID, if there is a matching record, the function
 * will overwrite the old record with the new data from the PUT request body.
 */
app.put('/students/:record_id', function(req, res) {
  var record_id = req.params.record_id;
  var fname = "students/" + record_id + ".json";
  var rsp_obj = {};
  var obj = {};

  obj.record_id = record_id;
  obj.first_name = req.body.first_name;
  obj.last_name = req.body.last_name;
  obj.gpa = req.body.gpa;
  obj.enrolled = req.body.enrolled;

  var str = JSON.stringify(obj, null, 2);

  console.log("PUT | JSON: " + str);

  //check if file exists
  fs.stat(fname, function(err) {
    if(err == null) {

      //file exists
      fs.writeFile("students/" + record_id + ".json", str, function(err) {
        console.log("Checking if " + record_id + ",json exists");
        var rsp_obj = {};
        if(err) {
          rsp_obj.record_id = record_id;
          rsp_obj.message = 'error - unable to update resource';
          return res.status(200).send(rsp_obj);
        } else {
          console.log("Record found! Updating record...");
          rsp_obj.record_id = record_id;
          rsp_obj.message = 'successfully updated';
          return res.status(201).send(rsp_obj);
        }
      });
      
    } else {
      rsp_obj.record_id = record_id;
      rsp_obj.message = 'error - resource not found';
      return res.status(404).send(rsp_obj);
    }

  });

}); //end put method

/**
 * DELETE Function
 * Takes a Delete request with a parameter of the record ID. The function then checks to see if
 * there's an existing record with a matching ID, if there is a matching record, the function
 * will delete the record from the \students directory.
 */
app.delete('/students/:record_id', function(req, res) {
  var record_id = req.params.record_id;
  var fname = "students/" + record_id + ".json";

  console.log("DELETE | Record to delete: " + fname);

  fs.unlink(fname, function(err) {
    var rsp_obj = {};
    if (err) {
      rsp_obj.record_id = record_id;
      rsp_obj.message = 'error - resource not found';
      return res.status(404).send(rsp_obj);
    } else {
      console.log("Record found! Deleting record...");
      rsp_obj.record_id = record_id;
      rsp_obj.message = 'record deleted';
      return res.status(200).send(rsp_obj);
    }
  });

}); //end delete method

app.listen(5678); //start the server
console.log('Server is running at http://localhost:5678');