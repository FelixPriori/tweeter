
/*
* Client-side JS logic goes here
* jQuery is already loaded
* Reminder: Use (and do all your DOM work in) jQuery's document ready function
*/

$(document).ready(() => {
  
  const formatTime = timestamp => {
    const timestampNow = new Date();
    const hours = Math.round(Math.abs(timestamp - timestampNow) / 36e5);
    if (hours > 24) {
      const days = Math.round(hours / 24);
      if (days > 365) {
        const years = Math.round(days / 365);
        const daysLeft = days % 365;
        return years === 1 ? `${years} year, ${daysLeft} days ago` : `${years} years, ${daysLeft} days ago`;
      }
      return days === 1 ? `${days} day ago` : `${days} days ago`;
    }  else {
      return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
    }
  }

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

    // assigning element's values
    $img.attr("src", `${tweet["user"]["avatars"]}`);
    $nameDiv.text(`${tweet["user"]["name"]}`);
    $usernameDiv.text(`${tweet["user"]["handle"]}`);
    $bodyDiv.text(`${tweet["content"]["text"]}`);
    $timeDiv.text(`${time}`);
    $iconsDiv.text(`🚩🔄❤️`);
  
    // appending children elements to the corresponding parent
    $header
      .append($img)
      .append($nameDiv)
      .append($usernameDiv);
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
      console.log($tweet)
      $('#tweet-container').append($tweet);
    });
  };

  $('#tweet-form').submit(function(event) {
    event.preventDefault();
  });

  const loadTweets = () => {
    $.get('/tweets', function(tweets) {
      renderTweets(tweets);
    });
  };

  loadTweets();

});
