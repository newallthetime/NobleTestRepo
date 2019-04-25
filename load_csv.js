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

        // creates object to insert into Advisor schema
        var csv_advisor = { 
          full_name: data['Insertion Order'].split('_')[3], 
          msid: data['Insertion Order'].split('_')[1]  
          }
        
        // creates object to insert into Campaign schema
        var csv_campaign = {
          full_name: data['Campaign'],
          campaign_id: data['Campaign ID']
        }
        
        // TODO: creates object to insert into Segment schema
        var csv_segment = {
          
        }

        // TODO: creates object to insert into State schema
        var csv_city = {
          
        }

        // TODO: creates object to insert into City schema
        var csv_city = {
          
        }
        
        // Function for segment if no ']' in 'Line Item'

        

        function find_segment() {

          if (data['Line Item'].includes(']') === false) {

            console.log(data['Line Item'])
            var line_item_parts = data['Line Item'].split('_')
            line_item_parts.shift()
            line_item_parts.shift()

            if ( ['PMP', 'Deals'].includes(line_item_parts.slice(-1)[0]) ) {
              line_item_parts.pop()
            }

            if ( ['PMP', 'Deals'].includes(line_item_parts.slice(-1)[0]) ) {
              line_item_parts.pop()
            }

            if ( ['desktop', 'mobile', ''].includes(line_item_parts.slice(-1)[0].toLowerCase()) ) {
              line_item_parts.pop()
            }

            if ( ('NORTH', 'EAST', 'SOUTH', 'WEST', 'NORTH EAST',
            'SOUTH EAST', 'NORTH WEST', 'SOUTH WEST',
            'NORTHEAST', 'MIDWEST').includes(line_item_parts.slice(0,0)) ) {
              line_item_parts.shift()
            }

            line_item_parts.shift()

            var segment_name = line_item_parts.slice(-1)[0]

            line_item_parts.pop()

            var state = line_item_parts.pop()

            console.log('segment name: ' + segment_name)
            console.log('state name: ' + state)

            console.log(line_item_parts)

          } 
          else 
          {
            var creative_parts = data['Creative'].split('_')
            
            if ( ['Image', 'Text', 'IT', 'T', 'V2', 'NB', 'NBText', 'AT', 
            'PText', 'TT', 'MT', '2', 'Text2', 'Image2'].includes(creative_parts.slice(-1)[0]) ) {
              creative_parts.pop()
            }
            
            

            console.log(creative_parts)

          }


        }

        find_segment()


        // fix this so it catches dupes on initial load
        advisor.find(csv_advisor, function (err, docs) {
            if (docs.length) {
                console.log('advisor exists');
            } else {
                advisor.insertMany(csv_advisor)
            }
        });

        // fix this so it catches dupes on initial load
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




