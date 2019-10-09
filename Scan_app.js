const Noble = require("noble");
var _ = require('lodash');
const BeaconScanner = require("node-beacon-scanner");

var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyS0', {
   baudRate: 9600,
   dataBits: 8,
   parity: 'none'
   });
 
var scanner = new BeaconScanner();
var beaconArray = [];
var dedupArray   = [];
 
scanner.onadvertisement = (advertisement) => {
      var beacon = advertisement ["iBeacon"];
      beaconArray.push(beacon.uuid);
	//       beaconArray.push(beacon.rssi = advertisement["rssi"]);
	//       beacon.uuid = advertisement["uuid"];
	//       console.log(JSON.stringify(beacon.uuid, null, "   "));
	  console.log(beacon.uuid);
	//       console.log(beaconArray);
   	}

port.on("open", function () { console.log("Port is open!"); });
port.write('AT$RC\r');
port.on('data', function(data) {console.log("Reset of Channel  " + data);  });

scanner.startScan().then(() => {
          console.log("Scanning started...");
    }).catch(error => {
          console.error(error); })
 
setTimeout((function() 
 {
	//	Now deduplicate the array and publish the number of unique UUIDs
	dedupArray = _.uniq(beaconArray);
        console.log(dedupArray.length + " Beacons found.");
	//   	Send the Beacon count nfo using AT command 
        var sfsend = "AT$SF=0" + dedupArray.length.toString(10) +"\r";
  	console.log("Sigfox command will be " + sfsend);
	port.write(sfsend);
	beaconArray = [];
	return(0); }), 5000);

  //    return process.exit(22); }), 5000);

