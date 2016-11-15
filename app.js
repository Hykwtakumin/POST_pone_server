var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var request = require('request');
var twitterAPI = require('node-twitter-api');

// DBへの接続
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/post_pone_server');

// モデルの宣言
var Tweet = require('./app/models/tweet');


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

//test
router.get('/', function(req, res) {
    res.json({ message: 'Successfully Posted a test message.' });
});

// /users というルートを作成する．
// ----------------------------------------------------
router.route('/tweets')

// ユーザの作成 (POST http://localhost:3000/api/tweets)
    .post(function(req, res) {

        // // 新しいモデルを作成する．
        // var tweet = new Tweet();
        // var repedTW;

        // 各カラムの情報を取得する．
        console.log(req.body);

        // var parsed_req_body = JSON.parse(req.body);

        //
        // tweet.clientID = req.body.clientID;
        // tweet.repUUID = req.body.repUUID;
        // tweet.authToken = req.body.authToken;
        // tweet.in_reply_to_status_id = req.body.repID;
        // tweet.repTW = req.body.repTW;
        // tweet.repComment = req.body.repComment ;
        // tweet.repURL =req.body.repURL;
        // tweet.sendPerson = req.body.sendPerson;
        // tweet.isOK = req.body.isOK;
        //
        // client.get('statuses/show', {id: req.body.repID}, function(error, tweets, response){
        //     if(error) throw error;
        //     console.log(tweets.text);
        //     tweet.repedTW= tweets.text;
        // });
        //
        // // tweets情報をセーブする．
        // tweet.save(function(err){
        //     if (err)
        //         res.send(err);
        //
        //     client.post('direct_messages/new', {screen_name: 'youngsnow_sfc', text: 'youngsnow_sfcさんが、\n'
        //         + tweet.repURL +'に対して\n' + '"' +tweet.repTW
        //         + '"\n' + 'とつぶやこうとしましたがいいですか?\n\n'
        //         + 'はい→ https://localhost:3000/acccept/\n'
        //         + 'だめ→https://localhost:3000/deny/'}, function(error, tweets, response){
        //         if(error) throw error;
        //         console.log('DM_ID:', tweets.id, 'sender_id', tweets.sender_id, 'recipient_id', tweets.recipient_id, 'created_at', tweets.created_at);
        //     });
        //
        //     res.json({ repedTW: repedTW });
        //
        //     // res.json(req.body);
        // });
    })

    //全てのユーザ一覧を取得 (GET)
    .get(function(req, res) {
        Tweet.find(function(err, tweets) {
            if (err)
                res.send(err);
            console.log('res.json');
            res.json(tweets);
        });
    });
//-----------追記ここまで-----------
router.route('/tweets/:repUUID')
//
// 1人のユーザの情報を取得 (GET http://localhost:3000/api/tweets/:repUUID)
    .get(function(req, res) {
        //user_idが一致するデータを探す．
        Tweet.find({repUUID: req.params.repUUID}, function(err, tweet) {
            if (err)
                res.send(err);
            res.json(tweet);
        });
    })
    // // 1人のユーザの情報を更新 (PUT http://localhost:3000/api/tweets/:repUUID)
    // .put(function(req, res) {
    //     Tweet.findById(req.params.repUUID, function(err, tweet) {
    //         if (err)
    //             res.send(err);
    //         // ユーザの各カラムの情報を更新する．
    //         tweet.repTW = req.body.repTW;
    //         tweet.repComment = req.body.repComment;
    //
    //         tweet.save(function(err) {
    //             if (err)
    //                 res.send(err);
    //             res.json({ message: 'Tweet updated!' });
    //         });
    //     });
    // })

    // 1人のユーザの情報を削除 (DELETE http://localhost:3000/api/tweets/:repUUID)
    .delete(function(req, res) {
        Tweet.remove({
            _id: req.params.repUUID
        }, function(err, tweet) {
            if (err)
                res.send(err);
            res.json({ message: 'Successfully deleted' });
        });
    });

router.route('/proofread/:repUUID')
// 1人のユーザの情報を更新 (PUT http://localhost:3000/api/tweets/:repUUID)
    .post(function(req, res) {
        Tweet.findById(req.params.repUUID, function(err, tweet) {
            if (err)
                res.send(err);
            // ユーザの各カラムの情報を更新する．
            tweet.repTW = req.body.repTW;
            tweet.repComment = req.body.repComment;

            tweet.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Tweet updated!' });
            });
        });
    });

router.route('/accept/:repUUID')
// 許可されたつぶやきをPOSTで代理投稿 (POST http://localhost:3000/api/accept/:repUUID)
    .get(function(req, res) {

        Tweet.find({repUUID: req.params.repUUID}, function(err, tweet) {
            if (err)
                res.send(err);

            var headers = {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Content-Type':'application/x-www-form-urlencoded',
                'X-Requested-With':'XMLHttpRequest'
            };

            var formData = {
                'authenticity_token': tweet.authToken ,
                'in_reply_to_status_id': tweet.in_reply_to_status_id,
                'is_permalink_page': false,
                'status:': tweet.repTW
            };

            var options = {
                url: 'https://twitter.com/i/tweet/create',
                method: 'POST',
                headers: headers,
                json: true,
                form: formData
            };

            request(options, function (err, res, body) {
                if (err)
                    console.log(err);

                console.log(res);
            });

            res.json(tweet);
        });
    });


//Socket.io用
io.sockets.on('connection', function(socket) {

    socket.on('post_tweet', function (data){
        var tweet = new Tweet();

        var repURL = '';

        tweet.clientID = data.clientID;
        tweet.authToken = data.authToken;
        tweet.repUUID = data.repUUID;
        tweet.in_reply_to_status_id = data.in_reply_to_status_id;
        tweet.repTW = data.repTW;
        tweet.repComment = data.repComment ;
        // tweet.repURL = data.repURL;
        tweet.sendPerson = data.sendPerson;
        tweet.isOK = data.isOK;
        client.get('statuses/show', {id: tweet.in_reply_to_status_id}, function(error, tweets, response){
            if(error) throw error;
            console.log(tweets);
            var repedTWID = tweets.id_str;
            var repedTWname = tweets.user.screen_name;
            repURL = 'https://twitter.com/' + repedTWname +'/status/'+repedTWID;
            // tweet.repedTW= tweets.text;
        });
        tweet.repURL = repURL;
        // console.log(data.sendPerson+repURL);

        // tweets情報をセーブする．
        tweet.save(function(err, res){
            if (err)
                console.log(err);

            client.post('direct_messages/new', {screen_name: 'youngsnow_sfc', text: 'youngsnow_sfcさんが、\n'
            + tweet.repURL +'に対して\n' + '"' +tweet.repTW
            + '"\n' + 'とつぶやこうとしましたがいいですか?\n\n'
            + 'はい→ https://localhost:3000/acccept/\n'
            + 'だめ→https://localhost:3000/deny/'}, function(error, tweets, response){
                if(error) throw error;
                console.log('DM_ID:', tweets.id, 'sender_id', tweets.sender_id, 'recipient_id', tweets.recipient_id, 'created_at', tweets.created_at);
            });

            // res.json({ repedTW: repedTW });

            // res.json(req.body);
        });
    });
}
);



// ルーティング登録
app.use('/api', router);

//サーバ起動
http.listen(port);
console.log('listen on port ' + port);
