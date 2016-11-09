var express = require('express');
var app = express();


// DBへの接続
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/jsonAPI');

// モデルの宣言
var Tweets = require('./app/models/tweets');

var bodyParser = require('body-parser');
var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: 'ySrU0GId6X8mXol2Hp8w8zfNU',
    consumer_secret: 'dbTrSxw4kAmwzovJkzmjFJ5Un692nMvijRFAoyaQ0NieovAHdF',
    access_token_key: '3215271243-VCY1Fu6Urihck0PPPYyix4ehpnY5IXfIww4lhve',
    access_token_secret: 'WLLGWbfiZwzrB0pdOU9I3cKYouGHoQ7TdIaNosD6G3zTH'
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

var router = express.Router();

router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

// /users というルートを作成する．
// ----------------------------------------------------
router.route('/posttweet')

// ユーザの作成 (POST http://localhost:3000/api/tweetdata)
    .post(function(req, res) {

        // 新しいモデルを作成する．
        var tweets = new Tweets();

        // 各カラムの情報を取得する．
        tweets.in_reply_to_status_id = req.body.repID;
        tweets.ptweets = req.body.ptweets;

        // tweets情報をセーブする．
        tweets.save(function(err){
            if (err)
                res.send(err);

            // var params = {screen_name: 'nodejs'};
            // client.get('statuses/user_timeline', params, function(error, tweets, response) {
            //     if (!error) {
            //         console.log(tweets);
            //     }
            // });
            res.json({ message: 'Tweet posted!' });
        });

    })

    // 全てのユーザ一覧を取得 (GET http://localhost:8080/api/users)
    // .get(function(req, res) {
    //     User.find(function(err, users) {
    //         if (err)
    //             res.send(err);
    //         res.json(users);
    //     });
    // });
//-----------追記ここまで-----------

//test
router.get('/', function(req, res) {
    res.json({ message: 'Successfully Posted a test message.' });
});


// ルーティング登録
app.use('/api', router);

//サーバ起動
app.listen(port);
console.log('listen on port ' + port);
