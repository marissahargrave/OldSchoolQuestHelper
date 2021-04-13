const { request } = require('express');
var express = require('express');
var app = express();

var questList = require('./services/getQuestList.js');
var userStats = require('./services/getUserStats.js');

var serverPort = 8124;

app.use( function (req, res, next) {
    res.set("Access-Control-Allow-Origin", "*");
    next();
});

app.get('/questList', function (req, res) {
    questList.getQuestList.then((quests)=> {
        var questJSON = JSON.stringify({ raw: quests.toString() });

        res.send(questJSON);
    })
    .catch((error)=>{
        res.status(400).send(error);
    });
})

app.get('/questDetails'),function (req,res){

}

app.get('/user/:username', function (req, res) {
    var user = req.params.username;

    userStats.getUserStats(user).then((stats) =>{

        res.send(stats);
    })
    .catch((error)=>{
        res.status(400).send(error);
    });
})

app.listen(serverPort);





