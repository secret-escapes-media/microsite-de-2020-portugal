

///////////////////////////////////////
// GET OFFERS FROM GOOGLE SHEET
///////////////////////////////////////

// get all offer sections on page
var offerSections = $('.js-dynamic-offers');


// loop over offer sections to gather deals from correct sheet
$(offerSections).each(function(){
  var offerSection = $(this);
  var sheetName = offerSection.data('offer-sheet');
  if( offerSection.data('offer-limit') ) {
    var limiter = offerSection.data('offer-limit') - 1;// -1 to balance against index number
  }else{
    var limiter = 30;// -1 to balance against index number
  }

  /*===== QUERY GOOGLE SHEET =====*/
  var spreadsheetID = "1BBXojQJgeObQoznZKicCsw00cF4S8g_KzE8rmHwtnYc"; // ID of Google Spreadsheet
  var apiKey = "AIzaSyBww8fHIRizAYPWsYyNGcRvLvzTLvvKmkw"; // API key for accessing G Sheet
  var url = "https://sheets.googleapis.com/v4/spreadsheets/" + spreadsheetID + "/values/" + sheetName + "!A3:Z?&key=" + apiKey;

  // JSON request
  $.getJSON(url, function(data) {
    var rawData = data.values;
    var deals = rawData.filter(function(item){
      return item[0] != 0;
    });

    // sort by discount
    var sortedDeals = deals.sort(function(a,b){ return a[6] > b[6] ?1 :-1 });

    offerSection.empty(); // remove loading icon
    // loop through deals and build HTML for output
    $(deals).each(function(i){
      // check deal "end date" to ensure it exists
      if(this[7]){
        // limit iteration
        if(i>limiter) return false;

        var saleTitle             = this[1];
        var saleLocation          = this[2];
        var saleDescription       = this[3];
        var salePrice             = this[4];
        var salePriceDescription  = this[5];
        var saleDiscount          = this[6];
        var saleEndDate           = this[7];
        var saleURL               = this[9];
        var saleImage             = this[10];
        var saleTags              = this[11];

        var htmlCol          = '<div class="col"></div>';
        var htmlOffer        = '<div class="offer depth--sm depth--sm-hover rounded--sm"></div>';
        var htmlLink         = '<a class="offer__link" href="'+saleURL+'"><span class="btn btn--orange">Zum Angebot</span></a>';
        var htmlImage        = '<div class="bg-img bg-img--16-9" style="background-image: url('+saleImage+')"></div>';
        var htmlCountdown    = '<div class="offer__expires js-offer-expires text--sm" data-expires="'+saleEndDate+'" style="display:none;"></div>';
        var htmlTags         = '<div class="offer__tags"></div>';
        var htmlContentWrap  = '<div class="boxpad--lg"></div>';
        var htmlLocation     = '<div class="offer__location">'+saleLocation+'</div>';
        var htmlTitle        = '<h2 class="offer__title">'+saleTitle+'</h2>';
        var htmlDescription  = '<div class="offer__description">'+saleDescription+'</div>';
        var htmlBottom       = '<div class="offer__bottom"></div>';
        var htmlBottomLeft   = '<div class="offer__bottom-left"><div class="offer__details">Ab <span class="offer__price">€'+salePrice+'</span> '+salePriceDescription+'</div></div>';

        if(saleTags.indexOf("refundable") >= 0){
          htmlTags = $(htmlTags).append("<div class='offer__tag offer__tag-refundable'>Stornierbar</div>");
        }
        if(saleTags.indexOf("customisable") >= 0){
          htmlTags = $(htmlTags).append("<div class='offer__tag offer__tag-customisable'>Konfigurierbar</div>");
        }
        if (saleTags.indexOf("flights") >= 0){
          htmlTags = $(htmlTags).append("<div class='offer__tag offer__tag-flights'>Flüge</div>");
        }

        if(saleDiscount > 0){
          var htmlBottomRight  = '<div class="offer__bottom-right"><div class="offer__discount">-'+saleDiscount+'%</div></div>';
        }else{
          var htmlBottomRight = '';
        }

        var bottom = $(htmlBottom).append(htmlBottomLeft).append(htmlBottomRight);
        var image = $(htmlImage).append(htmlCountdown).append(htmlTags);
        var content = $(htmlContentWrap).append(htmlLocation).append(htmlTitle).append(htmlDescription).append(bottom);
        var inner = $(htmlOffer).append(htmlLink).append(image).append(content);
        var offer = $(htmlCol).append(inner);

        $(offerSection).prepend(offer);
        $('body').addClass('offers-loaded');
      }// end if
    });// end forloop of deals
  });// end JSON request

});//end forloop of offerSections

setTimeout(function(){
  expiryDates();
},5000);