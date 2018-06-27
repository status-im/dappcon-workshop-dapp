import $ from 'jquery';
import {DTwitter} from 'Embark/contracts';
import EmbarkJS from 'Embark/EmbarkJS';

window.EmbarkJS = EmbarkJS;
window.DTwitter = DTwitter;

let tweetEvent;
$(document).ready(function() {

  // Create Account
  $(".createProfile").click(function() {
    let username = $(".createProfileView input[name=username]").val();
    let description = $(".createProfileView input[name=description]").val();
    EmbarkJS.onReady(function(){
        DTwitter.methods.createAccount(username, description).send({gas: 800000});
    });
  });

  // View Account
  $(".viewUsername").click(function() {
    let username = $(".viewUser input[name=username]").val();
    console.log('username: ' + username + ', hash: ' + web3.utils.keccak256(username));
    DTwitter.methods.users(web3.utils.keccak256(username)).call().then(function(user) {
      console.log('user: ' + JSON.stringify(user));
      updateProfile({
        username: user.username,
        description: user.description,
        picture: EmbarkJS.Storage.getUrl(user.picture)
      });
    });

    if(!tweetEvent) return;

    if (tweetEvent) {
      tweetEvent.stop();
    }

    $("#tweets").empty();

    // Listen to tweets
    tweetEvent = DTwitter.events.NewTweet({_from: web3.utils.keccak256(username)}, {fromBlock: 0});
    tweetEvent.then(function(event) {
      let index = event.args.index.toNumber();
      DTwitter.methods.getTweet(username, index).call().then(function(tweet) {
        addTweet({text: tweet});
      });
    });

  });

  // Edit Account Description
  $("#edit-profile-info button").click(function() {
    let username = $(".viewUser input[name=username]").val();
    let description = $("#edit-profile-info .description").val();

    DTwitter.methods.editAccount(username, description).send({gas: 800000});
  });

  // Upload Photo
  $("#edit-profile-photo button").click(function() {
    let username = $(".viewUser input[name=username]").val();
    let uploadInput = $("input[type=file]");

    EmbarkJS.Storage.uploadFile(uploadInput).then(function(hash) {
      DTwitter.methods.updateProfilePicture(username, hash).send({gas: 800000});
    });
  });

  // Make a Tweet
  $("#doTweet button").click(function() {
    let username = $(".viewUser input[name=username]").val();
    let text = $("input[name=text]").val();

    DTwitter.methods.tweet(username, text).send({gas: 800000});
  });

});
