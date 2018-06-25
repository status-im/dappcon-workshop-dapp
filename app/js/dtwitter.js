import $ from 'jquery';
import {DTwitter} from 'Embark/contracts';
import EmbarkJS from 'Embark/EmbarkJS';

window.EmbarkJS = EmbarkJS;
window.DTwitter = DTwitter;

var tweetEvent;
$(document).ready(function() {

  // Create Account
  $(".createProfile").click(function() {
    var username = $(".createProfileView input[name=username]").val();
    var description = $(".createProfileView input[name=description]").val();
    EmbarkJS.onReady(function(){
        DTwitter.createAccount(username, description, {gas: 800000});
    });
  });

  // View Account
  $(".viewUsername").click(function() {
    var username = $(".viewUser input[name=username]").val();
    console.log('username: ' + username + ', hash: ' + web3.utils.keccak256(username));
    DTwitter.users(web3.utils.keccak256(username)).then(function(user) {
      console.log('user: ' + user);
      updateProfile({
        username: user[1],
        description: user[2],
        photoUrl: EmbarkJS.Storage.getUrl(web3.toAscii(user[4]))
      });
    });

    if (tweetEvent) {
      tweetEvent.stop();
    }

    $("#tweets").empty();

    // Listen to tweets
    tweetEvent = DTwitter.NewTweet({_from: web3.utils.keccak256(username)}, {fromBlock: 0});
    tweetEvent.then(function(event) {
      var index = event.args.index.toNumber();
      DTwitter.getTweet(username, index).then(function(tweet) {
        addTweet({text: tweet});
      });
    });

  });

  // Edit Account Description
  $("#edit-profile-info button").click(function() {
    var username = $(".viewUser input[name=username]").val();
    var description = $("#edit-profile-info .description").val();

    DTwitter.editAccount(username, description);
  });

  // Upload Photo
  $("#edit-profile-photo button").click(function() {
    var username = $(".viewUser input[name=username]").val();
    var uploadInput = $("input[type=file]");

    EmbarkJS.Storage.uploadFile(uploadInput).then(function(hash) {
      DTwitter.updateProfilePicture(username, hash);
    });
  });

  // Make a Tweet
  $("#doTweet button").click(function() {
    var username = $(".viewUser input[name=username]").val();
    var text = $("input[name=text]").val();

    DTwitter.tweet(username, text);
  });

});
