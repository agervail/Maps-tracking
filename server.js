var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , fs = require('fs');

server.listen(1234);
io.set('log level', 1);
io.set('transports', ['xhr-polling', 'jsonp-polling']);

//variables
var pos = [25.3,22.1];
var tracks = [];
var trackOn = false;

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
app.get('/jumbo', function (req, res) {
  res.sendfile(__dirname + '/jumbo.html');
});
app.get('/jumbotron-narrow.css', function (req, res) {
  res.sendfile(__dirname + '/jumbotron-narrow.css');
});
app.get('/mobile.html', function (req, res) {
  res.sendfile(__dirname + '/mobile.html');
});
app.get('/path.js', function (req, res) {
  res.sendfile(__dirname + '/path.js');
});



app.get('/new_pos', function (req, res) {

  lat = parseFloat(req.param('lat'));
  lng = parseFloat(req.param('lng'));
  pos = [lat, lng]
  res.send('truc ' + lat)
  var date = new Date();
  console.log('last pos update = ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
              + ' --> ' + lat + '/' + lng );
  fs.appendFile('data.txt', date.getTime() + ':' + lat + '/' + lng + '\n',function (err) {
    if (err) throw err;
    console.log('The "data to append" was appended to file!');
  });
  if(trackOn != false){
    fs.readFile('path.js', 'utf8', function (err,data) {
      if (err) { return console.log(err); }
      var result = data.replace(/];/g, ",new google.maps.LatLng("+lat+","+lng+")\n];");
      fs.writeFile('path.js', result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    });
  }
});

app.get('/new_track', function(req, res){
  startLat = parseFloat(req.param('lat'));
  startLng = parseFloat(req.param('lng'));
  id = req.param('id');
  tracks[id] = [[startLat, startLng]];
  trackOn = id;
  console.log(id);
  fs.writeFile('path.js', "path=[new google.maps.LatLng("+startLat+","+startLng+")\n];",function (err) {
    if (err) throw err;
    console.log('new track');
  });
  res.send('new_track')
});



io.sockets.on('connection', function (socket) {
  var client;
  var ok_init = false;
  console.log('new connection');
  socket.on('end_of_init', function (data) {
    console.log('end_of_init ' + data['my']);
    console.log(data)
    client = data['my'];
    ok_init = true;
    socket.emit('news', { lat: pos[0], lng: pos[1] });
  });
  /*socket.on('truc', function (data) {
    console.log('truc' + data['my']);
    console.log(data)
    client = data['my'];
    ok_init = true;
    socket.emit('news', { lat: pos[0], lng: pos[1] });
  });*/
  var interID = setInterval(function(){
    if(ok_init){
      socket.emit('news_track', { lat: pos[0], lng: pos[1] });
      console.log('position sent to ' + client);
    }
  }, 5 * 1000);

  socket.on('disconnect', function(){
    console.log('client ' + client + ' disconnected');
    clearInterval(interID);
  });


});
