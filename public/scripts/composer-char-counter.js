$(document).ready(() => {
  // --- our code goes here ---
  const $textarea = $('#tweet');
  const $counter = $('.counter');
  $textarea.on('keyup', function() {
    const count = 140 - this.value.length;
    if (count < 0) {
      $counter.html(count).css('color', 'red');
    } else if (count >= 0) {
      $counter.html(count).css('color', 'black');
    }
  });
});