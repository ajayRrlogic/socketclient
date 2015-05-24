'use strict';

var gpsTest = require('./gpsTest.js');
var dateFormat = require('dateformat');



var net = require('net');
var HOST = '127.0.0.1';
var PORT = 5000;
var timeout = 30000;




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

  retString = degree.toString() + decimal.toString();
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

testClient.prototype.sendTestRequests = function()
{
  //get all the routes
  arrayOfRoutes = gpsTest.getRoute(10,12.957251,77.701163,60,0.1,300);

  //for(var i =0;i<arrayOfRoutes.length;i++)
  {
    setTimeout(timerCallBack,1000);
  }

};



module.exports = testClient;
