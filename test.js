'use strict';

var gpsTest = require('./gpsTest.js');
var dateFormat = require('dateformat');



var net = require('net');
var HOST = '127.0.0.1';
var PORT = 5000;
var timeout = 30000;
var prompt1 = require('prompt');





//this module will send a request to the socket server every
//1 miniute with a location data

var arrayOfRoutes;
var index = 0;

//this function will convert the lat to NMEA format
function getNMEALatLng(latLng)
{
  var retString;
  var degree = Math.floor(latLng);
  var decimal = latLng - degree;
  //convert the decimal to minutes
  decimal = decimal * 60;
  var decString = decimal.toString();
  if(decimal < 10) //single digit then add zero
  {
    decString = '0' + decString;

  }
  retString = degree.toString() + decString;
  console.log('lat before:'+latLng + 'after:'+retString);
  retString = retString.substr(0,9);//only 9 digits
  return retString;

}

function getMsgToWrite()
{
  var msgToSend;
  var deviceID = '9744322255';
  if(index >=arrayOfRoutes.length)
  return 'end';
  var latLng = arrayOfRoutes[index];
  console.log('index:'+index);
  console.log('lat:'+latLng[0]+'lng:'+latLng[1]);
  var latString = getNMEALatLng(latLng[0]);
  var lngString = getNMEALatLng(latLng[1]);
  //get the current date in the format HHMMSS MMDDYY
  var now = new Date();
  var dateString = dateFormat(now, "hhMMssmmddyy");
  msgToSend = 'GS'+ deviceID + latString + lngString + dateString + '0010';
  return msgToSend;
}

function testClient()
{


}

function timerCallBack()
{
  //get the lat long based on index and send it on socke to the server
  var client = new net.Socket();
  client.connect(PORT, HOST, function() {
  	console.log('Connected');
  var msg =   getMsgToWrite();
  	client.write(msg);
  });
  client.on('data', function(data) {
  	console.log('Received: ' + data);
    if(data == 'OK' || index >= arrayOfRoutes.length)
    {
  	   client.end(); // kill client after server's response
    }

  });

  client.on('close', function() {
  	console.log('Connection closed');
    if(index < arrayOfRoutes.length)
    {
      setTimeout(timerCallBack,1000);
    }


  });

  index++;

}


function getUserInputs(callback)
{
  var userInput = {};
  //start lat
  //direction
  //speed

  // Start the prompt
  //
  console.log('no validation done on lat long !!');
  prompt1.start();




  //
  // Get two properties from the user: username and email
  //
  prompt1.get(['start_latitude','start_longitude', 'direction','speed'], function (err, result) {
    //
    // Log the results.

      if (err) {
        console.log(err,null);
        return ; }

    //
    console.log('Command-line input received:');
    console.log('  start_latitude: ' + result.start_latitude);
    console.log('  start_longitude: ' + result.start_longitude);
    console.log('  angle: ' + result.direction);
    console.log('  speed: ' + result.speed);
    callback(null,result);
  });


}

function userDataCallback(err,result)
{
  if(err)
  {
    console.log('error in user inputs');
  }
  else {
    {
      arrayOfRoutes = gpsTest.getRoute(100,result.start_latitude,result.start_longitude,result.speed,0.007,result.direction);

      //for(var i =0;i<arrayOfRoutes.length;i++)
      {
        setTimeout(timerCallBack,1000);
      }
    }
  }
}

testClient.prototype.sendTestRequests = function()
{
  //get all the routes
  getUserInputs(userDataCallback);
  /*
  arrayOfRoutes = gpsTest.getRoute(100,14.957251,77.701163,60,0.1,300);

  //for(var i =0;i<arrayOfRoutes.length;i++)
  {
    setTimeout(timerCallBack,1000);
  }
*/
};



module.exports = testClient;
