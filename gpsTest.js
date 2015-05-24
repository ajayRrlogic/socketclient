'use strict';


//lat, lng in degrees. Bearing in degrees. Distance in Km
var calculateNewPostionFromBearingDistance = function(lat, lng, bearing, speed,nextTime) {
  var R = 6371; // Earth Radius in Km
  var distance = speed * nextTime; //speed * time
  var lat2 = Math.asin(Math.sin(Math.PI / 180 * lat) * Math.cos(distance / R) + Math.cos(Math.PI / 180 * lat) * Math.sin(distance / R) * Math.cos(Math.PI / 180 * bearing));
  var lon2 = Math.PI / 180 * lng + Math.atan2(Math.sin( Math.PI / 180 * bearing) * Math.sin(distance / R) * Math.cos( Math.PI / 180 * lat ), Math.cos(distance / R) - Math.sin( Math.PI / 180 * lat) * Math.sin(lat2));

  return [180 / Math.PI * lat2 , 180 / Math.PI * lon2];
};


var getRoute = function(numEvents,lat,lng,speed,timegap,angle)
{
  var arrPath = [];
  var latLong = [10,10];
  latLong[0] = lat;
  latLong[1] = lng;
  for(var i = 0;i<numEvents;i++)
  {
    console.log(latLong);
    console.log(timegap);
    latLong = calculateNewPostionFromBearingDistance(latLong[0],latLong[1],angle,speed,timegap);
    console.log(latLong);
    arrPath.push(latLong);
  }
  return arrPath;

};

exports.getRoute = getRoute;
