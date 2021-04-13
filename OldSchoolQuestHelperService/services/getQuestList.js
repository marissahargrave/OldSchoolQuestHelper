var https = require('https');

//var https = require('follow-redirects').https;
//var fs = require('fs');


//const questListURL = "https://oldschool.runescape.wiki/w/Quests/List";
exports.getQuestList = new Promise((resolve, reject) => {
    // var questList = {
    //     raw: ''
    // };

    var options = {
        'method': 'GET',
        'hostname': 'oldschool.runescape.wiki',
        'path': '/w/Quests/List',  
        'maxRedirects': 20
    };
              
    var req = https.request(options, function (res) {  
          var chunks = [];
          res.on("data", function (chunk) {
                chunks.push(chunk);  
          });
          res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                resolve(body);
          });
          res.on("error", function (error) {
                reject(error);
          });
          
    });
    req.end();
    
});