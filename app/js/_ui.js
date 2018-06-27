import $ from 'jquery';
import imgAvatar from '../img/avatar-default.png';

$(document).ready(function() {

  $('#profile img').attr('src', imgAvatar);

  $(".editLink").click(function() {
    $("#edit-profile-info").slideToggle();
  });

  $(".createLink").click(function() {
    $(".createProfileView").show();
    $(".profileView").hide();
  });

  $(".viewUsername").click(function() {
    $(".createProfileView").hide();
    $(".profileView").show();
  });

});

window.updateProfile = function(opts) {
  let username = opts.username;
  let description = opts.description;
  let photo = opts.picture; 
  if (photo == null || photo == EmbarkJS.Storage.getUrl('')) {
     //photo = "http://i.imgur.com/xAmv5AO.jpg";
     photo = imgAvatar;
  }

  $(".profileView .profile-name").html(username);
  $(".profileView .profile-description").html(description);
  $(".profileView img").attr('src', photo).attr('alt', username);
};

window.addTweet = function(tweet) {
  $("#tweets").prepend('<blockquote><div class="tweet well">' + tweet.text + '</div></blockquote>');
};


