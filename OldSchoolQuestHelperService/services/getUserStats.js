var https = require('https');

//const questListURL = "https://oldschool.runescape.wiki/w/Quests/List";
exports.getUserStats = function(username)  { return new Promise((resolve, reject) => {

    path = '/m=hiscore_oldschool/index_lite.ws?player=' + username;
    var options = {
        'method': 'GET',
        'hostname': 'secure.runescape.com',
        'path': path,
        'maxRedirects': 20
    };
              
    var req = https.request(options, function (res) {  
          var chunks = [];
          res.on("data", function (chunk) {
                chunks.push(chunk);  
          });
          res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);

                //Why the API doesn't just send it this way is a mystery to me
                var statString = body.toString();
                stats = statString.split('\n');

                var statBlock = {
                    overall: stats[0].split(',')[1],
                    attack: stats[1].split(',')[1],
                    defence: stats[2].split(',')[1],
                    strength: stats[3].split(',')[1],
                    hitpoints: stats[4].split(',')[1],
                    ranged: stats[5].split(',')[1],
                    prayer: stats[6].split(',')[1],
                    magic: stats[7].split(',')[1],
                    cooking: stats[8].split(',')[1],
                    woodcutting: stats[9].split(',')[1],
                    fletching: stats[10].split(',')[1],
                    fishing: stats[11].split(',')[1],
                    firemaking: stats[12].split(',')[1],
                    crafting: stats[13].split(',')[1],
                    smithing: stats[14].split(',')[1],
                    mining: stats[15].split(',')[1],
                    herblore: stats[16].split(',')[1],
                    agility: stats[17].split(',')[1],
                    thieving: stats[18].split(',')[1],
                    slayer: stats[19].split(',')[1],
                    farming: stats[20].split(',')[1],
                    runecrafting: stats[21].split(',')[1],
                    hunter: stats[22].split(',')[1],
                    construction: stats[23].split(',')[1]
                }

                //var statsJSONString = JSON.stringify(statBlock);

                resolve(statBlock);
          });
          res.on("error", function (error) {
                reject(error);
          });
          
    });
    req.end();
})
}