// loops through each offer on page and sets the current days remaining
$('.js-offer-expires').each(function() {

  // gets the expires date from the object
  var date = new Date( $(this).data('expires') );
  var expires = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()+1
  );
//console.log(expires);
  $(this).countdown(expires, function(event) {
    if (event.elapsed) {
      // the expired date is in the past so the expired message is removed
      $(this.parentNode.parentNode.parentNode.parentNode.parentNode).remove();
    } else if (event.offset.totalDays === 0) {
      // there is 0 days left, just hours, so ends today
      $(this).html(event.strftime('Endet <strong>heute</strong>'));
    } else {
      // there are days left, outputs with either day or days
      $(this).html(event.strftime('Endet in <strong>%-D Tagen</strong>'));
    }
  });
});
