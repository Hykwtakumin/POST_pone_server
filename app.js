var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var request = require('request');

// DBへの接続
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/post_pone_server');

// モデルの宣言
var Tweet = require('./app/models/tweet');


var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: 'tD7m4goDXOZyH1XVw3TrePdI5',
    consumer_secret: 'R8vrnV0yfUZGx9D0PuNRUP04Enm315W5RAS3wq69d14Ce31Au5',
    access_token_key: '744660449157734401-zHXTVgUVQ3gsupW6F0j8m5VIJIEc5tH',
    access_token_secret: 'gRX1OjDIwVdGt4Wp1Qd9Bdmok3DgsKRif3X49rPwfwEEK'
});

//youngsnow
// consumer_key: 'oxf84n4J5QvwysVnX9gontFZ8',
// consumer_secret: 'JT0L9VCYSqC49GyjGjijFaF7pVvHvLGIxreHyB8oll1hXwLeBK',
// access_token_key: '3215271243-VCY1Fu6Urihck0PPPYyix4ehpnY5IXfIww4lhve',
// access_token_secret: 'WLLGWbfiZwzrB0pdOU9I3cKYouGHoQ7TdIaNosD6G3zTH'


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'html');
app.set('views', __dirname + '/app/views');

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
    .post(function(req, responce) {
        console.log(req.body);

        // responce.send(resData);
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
    .post(function (req, responce) {
        // var tweet = new Tweet();
        //
        // tweet.clientID = req.params.clientID;
        // tweet.authToken = req.params.authToken;
        // tweet.repUUID =  req.params.repUUID;
        // tweet.in_reply_to_status_id = req.params.in_reply_to_status_id;
        // tweet.repTW = req.params.repTW;
        // tweet.repComment = req.params.repComment ;
        // tweet.repURL = req.params.repURL;
        // tweet.sendPerson = req.params.sendPerson;
        // tweet.isOK = req.params.isOK;
        //
        // // tweets情報をセーブする．
        // tweet.save(function(err, res){
        //     if (err)
        //         console.log(err);
        //
        //     client.post('direct_messages/new', {
        //         screen_name: 'AheAhej9ueryMan',
        //         text: 'Mantani_puttaさんが、\n' + data.repURL +'に対して\n'
        //         + '"' + data.repTW
        //         + '"\n' + 'とつぶやこうとしましたがよろしいですか?\n\n'
        //         + '問題無い場合は"OK"と、\n'
        //         + '訂正、添削を行う場合は、その文章を入力してください\nby POST_pone'}, function(error, tweets, response){
        //         if(error) console.log(error);
        //         console.log('DM_ID:', tweets.id, 'sender_id', tweets.sender_id, 'recipient_id', tweets.recipient_id, 'created_at', tweets.created_at);
        //
        //         client.get('account/verify_credentials',
        //             { include_entities: false, skip_status: true },
        //             function (error, info, response) {
        //                 if (error) {
        //                     throw error;
        //                 }
        //                 var myid = info.id; //youngsnow_sfc
        //                 client.stream('user', function (stream) {
        //
        //                     stream.on('data', function (tweet) {
        //                         var dm = tweet && tweet.direct_message;
        //                         if (dm && dm.sender.id !== myid) {
        //                             console.log(dm.sender.screen_name, dm.text);
        //
        //                             if(dm.text == 'OK'){
        //                                 client.post('direct_messages/new', {
        //                                     screen_name: 'AheAhej9ueryMan',
        //                                     text: '了解です。送信を承認します。'}, function(error, tweets, response){
        //                                     if(error) console.log(error);
        //                                     console.log('DM_ID:', tweets.id, 'sender_id', tweets.sender_id, 'recipient_id', tweets.recipient_id, 'created_at', tweets.created_at);
        //                                     // socket.emit('confirm_tweet',{isConfirmed: true});
        //                                     responce({confirm_result:true});
        //                                     // stream.destroy();
        //                                 });
        //                             }else{
        //                                 client.post('direct_messages/new', {
        //                                     screen_name: 'AheAhej9ueryMan',
        //                                     text: '了解です。改良文を送信します。'}, function(error, tweets, response){
        //                                     if(error) console.log(error);
        //                                     console.log('DM_ID:', tweets.id, 'sender_id', tweets.sender_id, 'recipient_id', tweets.recipient_id, 'created_at', tweets.created_at);
        //                                     // socket.emit('resend_tweet',{
        //                                     //     isConfirmed: false,
        //                                     //     //改良文
        //                                     //     draft_Text: dm.text
        //                                     // });
        //                                     responce({
        //                                         confirm_result:false,
        //                                         draft_Text: dm.text
        //                                     });
        //                                     // stream.destroy();
        //                                 });
        //                             }
        //                         }
        //                     });
        //
        //
        //                     stream.on('error', function (error) {
        //                         throw error;
        //                     });
        //
        //                 });
        //
        //             });
        //
        //     });
        //
        // });

    })


    // 1人のユーザの情報を取得 (GET http://localhost:3000/api/tweets/:repUUID)
    .get(function(req, res) {
        // user_idが一致するデータを探す．
        Tweet.find({repUUID: req.params.repUUID}, function(err, tweet) {
            if (err)
                res.send(err);
            // res.render('index', {
            //     tweettext: tweet.repTW
            // });
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

router.route('/confirm/:repUUID')
// 許可されたつぶやきをPOSTで代理投稿 (POST http://localhost:3000/api/accept/:repUUID)
    .get(function(req, res) {
        Tweet.find({repUUID: req.params.repUUID}, function(err, tweet) {
            if (err)
                res.send(err);


            res.json(tweet);
        });
    });


//Socket.io用
io.sockets.on('connection', function(socket) {

    socket.on('post_tweet', function (data, ack){
        var tweet = new Tweet();

        tweet.clientID = data.clientID;
        tweet.authToken = data.authToken;
        tweet.repUUID = data.repUUID;
        tweet.in_reply_to_status_id = data.in_reply_to_status_id;
        tweet.repTW = data.repTW;
        tweet.repComment = data.repComment ;
        tweet.repURL = data.repURL;
        tweet.sendPerson = data.sendPerson;
        tweet.isOK = data.isOK;

        // tweets情報をセーブする．
        tweet.save(function(err, res){
            if (err)
                console.log(err);

            client.post('direct_messages/new', {
                screen_name: 'AheAhej9ueryMan',
                text: '私は次のツイート\n' + data.repURL +'に対して\n'
                + '"' + data.repTW
                + '"\n' + 'とつぶやこうとしましたがよろしいですか?\n\n'
                + '問題無い場合は"OK"と、\n'
                + '訂正、添削を行う場合は、その文章を入力してください\nby POST_pone'}, function(error, tweets, response){
                if(error) console.log(error);
                console.log('DM_ID:', tweets.id, 'sender_id', tweets.sender_id, 'recipient_id', tweets.recipient_id, 'created_at', tweets.created_at);
            });

        });

        client.get('account/verify_credentials',
            { include_entities: false, skip_status: true },
            function (error, info, response) {
                if (error) {
                    throw error;
                }
                var myid = info.id; //youngsnow_sfc
                client.stream('user', function (stream) {

                    stream.on('data', function (tweet) {
                        var dm = tweet && tweet.direct_message;
                        if (dm && dm.sender.id !== myid) {
                            console.log(dm.sender.screen_name, dm.text);

                            if(dm.text == 'OK'){
                                client.post('direct_messages/new', {
                                    screen_name: 'AheAhej9ueryMan',
                                    text: '了解です。送信を承認します。'}, function(error, tweets, response){
                                    if(error) console.log(error);
                                    console.log('DM_ID:', tweets.id, 'sender_id', tweets.sender_id, 'recipient_id', tweets.recipient_id, 'created_at', tweets.created_at);
                                    // socket.emit('confirm_tweet',{isConfirmed: true});
                                    ack({confirm_result:true});
                                });
                                client.post('statuses/update', {status: data.repTW, in_reply_to_status_id: data.in_reply_to_status_id},  function(error, tweet, response) {
                                    if(error) throw error;
                                    console.log(tweet);  // Tweet body.
                                    console.log(response);  // Raw response object.
                                });
                                stream.destroy();
                            }else{
                                client.post('direct_messages/new', {
                                    screen_name: 'AheAhej9ueryMan',
                                    text: '了解です。査読結果を送信します。'}, function(error, tweets, response){
                                    if(error) console.log(error);
                                    console.log('DM_ID:', tweets.id, 'sender_id', tweets.sender_id, 'recipient_id', tweets.recipient_id, 'created_at', tweets.created_at);
                                    ack({
                                        confirm_result:false,
                                        draft_Text: dm.text
                                    });
                                });
                                stream.destroy();
                            }
                        }
                    });


                    stream.on('error', function (error) {
                        throw error;
                    });

                });

            });


    });

});

// ルーティング登録
app.use('/api', router);

//サーバ起動
http.listen(port);
console.log('listen on port ' + port);