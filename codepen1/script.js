/*
Firefox has the best developer tools for building with CSS Grid Layout
Ready to step up your game with CSS Grid? Just follow these steps:

Step 1: Download Firefox Nightly
https://www.mozilla.org/en-US/firefox/channel/desktop/#nightly

Step 2: While using Nightly, open Developer Tools
Windows: Ctrl + Shift + I
Mac: Cmd + Opt + I

Step 3: Select the layout panel, and then select the overlay grid you'd like to display
*/

$("a").on("click", function () {
  console.log('Hello world!');
  $("a").removeClass('active');
  $(this).addClass('active');
});


var setTime = function() {
  var time = moment().format('hh:mm');
  var date = moment().format('dddd, MMMM D');
  $('#date').html(date);
  $('#time').html(time);
};

setTime();