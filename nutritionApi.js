var request = require('request');
var fs = require('fs');

var nutritionKeys = fs.readFileSync("nutritionApiKey.key").toString();
nutritionKeys = nutritionKeys.split(" ");

function infoCallback(name,calories,serving_size) {    
    console.log(name);
    console.log(calories);
    console.log(serving_size);
}

//callback(name,calories,serving size(grams))
function UPCtoCal(UPCcode, callback) {
    if(UPCcode.length != 12) {
	    console.log("Incorrect UPCcode length");
    }
    
    var options = {
      url: 'https://trackapi.nutritionix.com/v2/search/item?upc=' + UPCcode,
      headers: {
        'x-app-id': "ce1f6580",
        'x-app-key': "6e6db97a57d1398e35ed04107d4d6f47"
	    }
    };
    
    var getFromApi = new Promise((resolve, reject) => {
	    request(options, function(error, response, body) {
	      if(!error && response.statusCode == 200) {
          JSONparsed = (JSON.parse(body))["foods"][0];
          infoArr = [JSONparsed["food_name"],JSONparsed["nf_calories"],
            JSONparsed["serving_weight_grams"]];
          resolve(infoArr);
	      } else {
          reject("Error from API endpoint");
        }
      })
    })

    getFromApi
    .then((object) => {
        callback(object[0],object[1],object[2]);
    })
    .catch((error) => {
        console.log(error);
    })
}

module.exports.UPCtoCal = UPCtoCal;
module.exports.infoCallback = infoCallback;
