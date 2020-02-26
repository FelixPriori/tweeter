
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
    const time = formatTime(tweet["created_at"]);
    const htmlifyTweet = `
      <article class="tweet-element">
        <header>
          <img class="avatar" src=${tweet["user"]["avatars"]}/>
          <div class="tweeter-name">
            ${tweet["user"]["name"]}
          </div>
          <div class="tweeter-username">
            ${tweet["user"]["handle"]}
          </div>
        </header>
        <div class="tweet-body">${tweet["content"]["text"]}</div>
        <footer>
          <div class="tweet-time">${time}</div>
          <div class="tweet-icons">🚩🔄❤️</div>
        </footer>
      </article>
    `;
    return htmlifyTweet;
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
