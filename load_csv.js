var csv = require('fast-csv');
var fs = require('fs');
var mongoose = require('mongoose');
var advisor = require('./models/Advisor')
var campaign = require('./models/Campaign')

var mongoDB = 'mongodb+srv://brianoconnell:lookup@cluster0-u02yz.mongodb.net/csv_test?retryWrites=true';
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;

db.once("open", () => { 

  console.log("connected to the database" + ' ' + mongoDB)

  var stream = fs.createReadStream('./test_csv.csv');

  csv
    .fromStream(stream, {headers : true })

    .on("data", function(data) {

        var csv_advisor = { 
          full_name: data['Insertion Order'].split('_')[3], 
          msid: data['Insertion Order'].split('_')[1]  
          }
        
        var csv_campaign = {
          full_name: data['Campaign'],
          campaign_id: data['Campaign ID']
        }
        
        advisor.find(csv_advisor, function (err, docs) {
            if (docs.length) {
                console.log('advisor exists');
            } else {
                advisor.insertMany(csv_advisor)
            }
        });

        campaign.find(csv_campaign, function (err, docs) {
          if (docs.length) {
              console.log('campaign exists');
          } else {
              campaign.insertMany(csv_campaign)
          }
      });

    })

    .on("end", function(){
        console.log("done");
    });

  });

db.on('error', console.error.bind(console, 'MongoDB connection error:'));








// let headers = Object.keys(lineitem.schema.paths)
//       .filter(k => ['_id','__v'].indexOf(k) === -1);




