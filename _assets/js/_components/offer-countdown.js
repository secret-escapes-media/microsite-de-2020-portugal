// loops through each offer on page and sets the current days remaining
function expiryDates() {
  $('.js-offer-expires').each(function() {

    // gets the expires date from the object
    var rawDate = $(this).data('expires');
    var processedDate = rawDate.split("/").reverse().join("/");

    var date = new Date( processedDate );
    var expires = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()+1
    );

    $(this).countdown(expires, function(event) {
      if (event.offset.totalDays === 0) {
        // there is 0 days left, just hours, so ends today
        $(this).show();
        $(this).html(event.strftime('Endet <strong>heute</strong>'));
      } else if (event.offset.totalDays < 30) {
        // there are days left, outputs with either day or days
        $(this).show();
        $(this).html(event.strftime('Endet in <strong>%-D Tagen</strong>'));
      }
    });
  });

}
