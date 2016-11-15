/**
 * Created by hykwtakumin on 2016/11/10.
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TweetSchema   = new Schema({
    repUUID: { type: String, required: true, unique: true },
    repURL: String,
    authToken : String,
    in_reply_to_status_id : { type: String, required: true },
    repTW: String,
    repedTW: String,
    repComment: String,
    sendPerson: String,
    isOK: Boolean
});

module.exports = mongoose.model('Tweet', TweetSchema);


//unique: true