var csv = require('fast-csv');
var fs = require('fs');
var mongoose = require('mongoose');

var advisor = require('./models/Advisor')
var campaign = require('./models/Campaign')
// var city = require('./models/City')
// var insertion_order = require('./models/Insertion_Order')
// var line_item = require('./models/Line_Item')
// var location = require('./models/Location')
// var monthly_stat = require('./models/Monthly_Stat')
// var segment = require('./models/Segment')
// var state = require('./models/State')

var mongoDB = 'mongodb+srv://brianoconnell:lookup@cluster0-u02yz.mongodb.net/csv_test?retryWrites=true';
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;

db.once("open", () => { 

  console.log("connected to the database" + ' ' + mongoDB)

  var stream = fs.createReadStream('./test_csv.csv');

  csv

    .fromStream(stream, {headers : true })

    .on("data", function(data) {

        console.log('starting line stream')

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

            // console.log(data['Line Item'])
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

            if ( ['NORTH', 'EAST', 'SOUTH', 'WEST', 'NORTH EAST',
            'SOUTH EAST', 'NORTH WEST', 'SOUTH WEST',
            'NORTHEAST', 'MIDWEST'].includes(line_item_parts.slice(0,0)[0]) ) {
              line_item_parts.shift()
            }

            line_item_parts.shift()

            var segment_name = line_item_parts.slice(-1)[0]

            line_item_parts.pop()

            var state = line_item_parts.pop()

            // console.log('segment name: ' + segment_name)
            // console.log('state name: ' + state)

            // console.log(line_item_parts)

          } 
          else 
          {
            var creative_parts = data['Creative'].split('_')
            
            if ( ['Image', 'Text', 'IT', 'T', 'V2', 'NB', 'NBText', 'AT', 
            'PText', 'TT', 'MT', '2', 'Text2', 'Image2'].includes(creative_parts.slice(-1)[0]) ) {
              creative_parts.pop()
            }

            var seg_parts = []
            var i = 0
            while (i < 5 && !creative_parts.slice(-1)[0].match(/\d+x\d+/) ) {
              seg_parts.push(creative_parts.slice(-1)[0])
              creative_parts.pop()
              i ++
            }
            seg_parts.reverse()

            var segment_name = seg_parts.join(' ')
            // console.log(get_seg_parts())
          
          }

          if (segment_name == 'Charity') {
            segment_name = 'Charitable Giving'
          }
          if (segment_name == 'Disability') {
            segment_name = 'Special Needs'
          }
          if (['Divorce', 'Divorce Planning #2'].includes(segment_name)) {
            segment_name = 'Divorce Planning'
          }
          if (['Family', 'Family Wealth Management #2',
          'Family WM', 'FA'].includes(segment_name)) {
            segment_name = 'Family Wealth Management'
          }
          if (['General', 'General Wealth Management #2',
          'General WM', 'WM', '420VN', 'Wealth', 'WA'].includes(segment_name)) {
            segment_name = 'General Wealth Management'
          }
          if (['General PWM', 'PWM'].includes(segment_name)) {
            segment_name = 'Private Wealth Management'
          }
          if (['PWM Inheritance', 'PWMT', 'Inheritance', 'PWM Investment Advice',
          'PWM Invest Advice', 'Estate PT', 'Estate'].includes(segment_name)) {
            segment_name = 'Wealth Transfer'
          }
          if (['HNWI', 'High Net Worth Investing #2',
          'High Net Worth', 'Net Worth', 'High NWT'].includes(segment_name)) {
            segment_name = 'High Net Worth Investing'
          }
          if (['Small Business', 'Small Businesst'].includes(segment_name)) {
            segment_name = 'Small Business Planning'
          }
          if (['Institution', 'Greystone', 'Institutional', 'Graystone',
          'InstitutionalConsulting', 'Graystone Team', 'Institutional Consult', 'Inst Consulting'].includes(segment_name)) {
            segment_name = 'Institutional Consulting'
          }
          if (segment_name == 'International') {
            segment_name = 'International Investing'
          }
          if (['Investing', 'Investing Advice #2', 'Investment Advicet',
          'Investment Advice', 'Invest Advice', 'Inves Advice', 'Investment'].includes(segment_name)) {
            segment_name = 'Investing Advice'
          }
          if (['Women And Finance', 'Women', 'Women F'].includes(segment_name)) {
            segment_name = 'Women & Finance'
          }
          if (['Diversity', 'LGBT'].includes(segment_name)) {
            segment_name = 'LGBT Financial Planning'
          }
          if (segment_name == 'Liability') {
            segment_name = 'Liability Management'
          }
          if (['Pre-Liquidity', 'Liquidity', 'Pre Liquidity', 'Pre', 'Pre LT'].includes(segment_name)) {
            segment_name = 'Pre-Liquidity Planning'
          }
          if (['Retirement', 'Retirement Planning #2'].includes(segment_name)) {
            segment_name = 'Retirement Planning'
          }
          if (['Social', 'Sustainable Investing', 'Sustainable', 'Sustain Invest',
          'Sustainable Invest'].includes(segment_name)) {
            segment_name = 'Social/Sustainable Investing'
          }
          if (segment_name == 'Tax') {
            segment_name = 'Tax Planning'
          }
        
        return segment_name

        }

        console.log(find_segment())


        // function addAdvisor(csv_data,cb){
        //   advisor.find(csv_data, function (err, docs) {
        //       if (docs.length){
        //           cb('Advisor exists already',null);
        //       }else{
        //           advisor.insertMany(csv_data, function(err){
        //               cb(err,csv_data);
        //           });
        //       }
        //   });
        // }
        
        // addAdvisor(csv_advisor, console.log)


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




