const express = require('express');
const request = require('request');
const path = require('path');
const {googleKey, docKey} = require('./config/config');
var googleMapsClient = require('@google/maps').createClient({
  key: googleKey
});

let app = express();
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
app.use(express.static(publicPath));

app.get('/doctorList', (req, res) => {
  var loc = req.get('x-value').loc;
  var radius = 50;
  var sortType = 'full-name-asc';
  var name = req.get('x-value').name;
  if (!name) {
    name = '';
  }

  var lat, lon;
  googleMapsClient.geocode({
    address: addr
  }, function(err, response) {
    if (!err) {
      //console.log(response.json.results[0].geometry.location);
      lat = response.json.results[0].geometry.location.lat;
      lon = response.json.results[0].geometry.location.lon;
    } else {
      res.status(500).send('Unable to connect to the server');
    }
  });

  var options = {
      url: `https://api.betterdoctor.com/2016-03-01/doctors?name=${name}&location=${lat}%2C${lon}%2C${radius}&user_location=${userLat}%2C${userLon}&sort=${sortType}&skip=0&limit=10&user_key=${docKey}`
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
            //console.log(JSON.stringify(dummyObj, null, '\t'));
          }
      } else if (error) {
        //console.log('error: ', error);
        res.status(500).send('Unable to fetch data');
      }
  }
  request(options, callback);
  res.status(200).send(JSON.stringify(objToSend));
});


app.listen(port, () => {
  console.log(`App running successfully on port ${port}`);
})
