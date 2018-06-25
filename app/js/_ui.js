import $ from 'jquery';

$(document).ready(function() {

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
  var username = opts.username;
  var description = opts.description;
  var photo = opts.photoUrl; 
  if (photo == null || photo == EmbarkJS.Storage.getUrl('')) {
     //photo = "http://i.imgur.com/xAmv5AO.jpg";
     photo = "http://localhost:8001/profile.jpg";
  }

  $(".profileView .profile-name").html(username);
  $(".profileView .profile-description").html(description);
  $(".profileView img").attr('src', photo);
};

window.addTweet = function(tweet) {
  $("#tweets").prepend('<blockquote><div class="tweet well">' + tweet.text + '</div></blockquote>');
};


