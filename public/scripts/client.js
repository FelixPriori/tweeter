
/*
* Client-side JS logic goes here
* jQuery is already loaded
* Reminder: Use (and do all your DOM work in) jQuery's document ready function
*/

$(document).ready(() => {

  // click event for the arrow which shows
  // the new tweet form.
  $('.new-tweet').hide();
  $('#arrow').click(() => {
    $('.new-tweet').slideToggle();
    $('#tweet').focus();
  });

  // scroll button for the up arrow
  $('.footer-button').hide();
  $(window).scroll(() => {
    // appears when scrolling lower than 400px from top
    // disappears when 400px and up
    if ($(window).scrollTop() > 400) {
      $('.footer-button').fadeIn('fast');
      $('#write').fadeOut('fast');
    } else {
      $('.footer-button').fadeOut('fast');
      $('#write').fadeIn('fast');
    }
  });

  // on click event for the up arrow
  $('#up').on('click', () => {
    $("html, body").animate({ scrollTop: "0" }, 1000);
    setTimeout(() => {
      $('.new-tweet').slideDown();
      $('#tweet').focus();
    }, 1000);
  });
  
  const formatTime = timestamp => {
    // compares current time to tweet creation date;
    const timestampNow = new Date();
    const hours = Math.round(Math.abs(timestamp - timestampNow) / 36e5);
    // determines the returned string based on number of hours.
    if (hours > 24) {
      const days = Math.round(hours / 24);
      if (days > 365) {
        const years = Math.round(days / 365);
        const daysLeft = days % 365;
        return years === 1 ? `${years} year, ${daysLeft} days ago` : `${years} years, ${daysLeft} days ago`;
      }
      return days === 1 ? `${days} day ago` : `${days} days ago`;
    } else {
      return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
    }
  };

  const createTweetElement = tweet => {
    //  calculating time & returning formating
    const time = formatTime(tweet["created_at"]);

    // constructing the tweet's html elements w/ class names
    const $article = $('<article class="tweet-element">');
    const $header = $('<header>');
    const $img = $('<img class="avatar"/>');
    const $nameDiv = $('<div class="tweeter-name">');
    const $usernameDiv = $('<div class="tweeter-username">');
    const $bodyDiv = $('<div class="tweet-body">');
    const $footer = $('<footer>');
    const $timeDiv = $('<div class="tweet-time">');
    const $iconsDiv = $('<div class="tweet-icons">');
    const $flagIcon = $('<i class="fa fa-flag icons">');
    const $retweetIcon = $('<i class="fa fa-retweet icons">');
    const $heartIcon = $('<i class="fa fa-heart icons">');

    // assigning element's values
    $img.attr("src", `${tweet["user"]["avatars"]}`);
    $nameDiv.text(`${tweet["user"]["name"]}`);
    $usernameDiv.text(`${tweet["user"]["handle"]}`);
    $bodyDiv.text(`${tweet["content"]["text"]}`);
    $timeDiv.text(`${time}`);
  
    // appending children elements to the corresponding parent
    $header
      .append($img)
      .append($nameDiv)
      .append($usernameDiv);
    $iconsDiv
      .append($flagIcon)
      .append($retweetIcon)
      .append($heartIcon);
    $footer
      .append($timeDiv)
      .append($iconsDiv);
    $article
      .append($header)
      .append($bodyDiv)
      .append($footer);

    // returning the finished article
    return $article;
  };

  const renderTweets = function(tweets) {
    // loops through tweets
    // calls createTweetElement for each tweet
    // takes return value and appends it to the tweets container
    tweets.forEach(tweet => {
      const $tweet = createTweetElement(tweet);
      $('#tweet-container').prepend($tweet);
    });
  };

  const isValid = tweet => {
    // checks if tweet is too big, or empty.
    // displays error if either checks fail
    // if both checks pass, returns true.
    if (tweet.length > 140) {
      $('#too-long').slideDown();
      setTimeout(() => {
        $('#too-long').slideUp();
      }, 5000);
    } else if (tweet.length === 0) {
      $('#no-text').slideDown();
      setTimeout(() => {
        $('#no-text').slideUp();
      }, 5000);
    } else {
      return true;
    }
  };

  $('#tweet-form').submit(function(event) {
    // prevent redirect default behaviour
    event.preventDefault();

    // characters reset to 140 - black upon submit
    const $counter = $('.counter');
    $counter.html(140).css('color', 'black');

    // tweet text is saved to a variable, then textarea is emptied
    const $tweet = $('#tweet')[0].value;
    $('#tweet')[0].value = '';

    // if tweet is valid, make POST request
    if (isValid($tweet)) {
      $.ajax({
        method: 'POST',
        url: '/tweets',
        data: {text: $tweet},
      }).then(() => {
        // after POST request, make GET request to render the tweet.
        $.ajax({
          method: 'GET',
          url: '/tweets'
        }).done(tweets => {
          // we select the tweet that was just created and render it on page
          const $tweet = createTweetElement(tweets[tweets.length - 1]);
          $('#tweet-container').prepend($tweet);
        });
      });
    }
  });

  // get request to load all tweets
  const loadTweets = () => {
    $.ajax({
      method: 'GET',
      url: '/tweets',
    }).done(tweets => renderTweets(tweets));
  };
  loadTweets();

});
