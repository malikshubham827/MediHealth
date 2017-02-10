const express = require('express');
const request = require('request');

let app = express();
const port = process.env.PORT || 3000;

// var PythonShell = require('python-shell');
//
// PythonShell.run('./my_script.py', function (err) {
//   if (err) throw err;
//   console.log('finished');
// });

app.get('/doctorList', (req, res) => {
  var lat = req.header.'x-value'.lat;
  var lon = req.header.'x-value'.lon;
  var radius = req.header.'x-value'.radius;
  var userLon = req.header.'x-value'.userLon;
  var userLat = req.header.'x-value'.userLat;
  var sortType = req.header.'x-value'.sortType;

  var options = {
      url: `https://api.betterdoctor.com/2016-03-01/doctors?location=${lat}%2C${lon}%2C${radius}&user_location=${userLat}%2C${userLon}&sort=${sortType}&skip=0&limit=10&user_key=0f19d3d98e79a0151530380a3576b721`
  };

  let objToSend = {obj: new Array(10)};

  function callback(error, response, body) {
      console.log('in the callback');
      if (!error && response.statusCode == 200) {
          body = JSON.parse(body);
          for(var i=0; i<10; i++) {
            var dummyObj = {
              name: body.data[i].practices[0].name,
              website: body.data[i].practices[0].website,
              address: body.data[i].practices[0].visit_address
            }
            objToSend.obj[i] = dummyObj;
            console.log(JSON.stringify(dummyObj, null, '\t'));
          }
      } else if (error) {
        //console.log('error: ', error);
        res.send('Unable to fetch data');
      }
  }
  request(options, callback);
  res.status(200).send(JSON.stringify(objToSend));
});

app.listen(port, () => {
  console.log(`App running successfully on port ${port}`);
})
