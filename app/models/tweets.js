/**
 * Created by hykwtakumin on 2016/11/10.
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TweetsSchema   = new Schema({
    in_reply_to_status_id : { type: String, required: true },
    ptweets: { type:String }
});

module.exports = mongoose.model('Tweets', TweetsSchema);


//unique: true