// general js for the project that wouldn't be a reuseable component

var coll = document.getElementsByClassName("bv-collapsible");

var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("bv-active");
    var content = this.previousElementSibling;
      console.log(content.style.maxHeight);
    //alert(content);
    if (content.style.maxHeight){
      content.style.maxHeight = null;

    } else {
      content.style.maxHeight = "500px";
      content.style.overflow = "auto";
    }
  });
}


// js for the design hotels page
(function ($, root, undefined) {$(function () {'use strict'; // on ready start


///////////////////////////////////////
//      image sliders
///////////////////////////////////////

  // global classes
  var sliderVisibleClass = 'is-visible';
  var sliderNotVisibleClass = 'is-not-visible';
  var lazyLoadClass = 'js-lazy-load';
  var lazyLoadLoadedClass = 'is-loaded';

  // build the html for the lazy load images
  $('.js-lazy-load-slider').each(function() {
    // get all the image elements, remove whitespace and convert them into html objects
    var contentHTML = $($.parseHTML(this.textContent.trim()));
    //console.log(contentHTML);
    // emtpy array that will be populated with the just image paths
    var imagePaths = [];
    // loop through array to remove the null whitespace entries
    for (var i = 0; i < contentHTML.length; i++) {
      var imagePath = $(contentHTML[i]).attr('src');
      if (typeof imagePath !== 'undefined') {
        imagePaths.push(imagePath);
        //console.log(imagePath);
      }
    }
    // insert lazy load image element for each image, starting with last image so in correct order
    for (var i = imagePaths.length; i > 0; i--) {
      var arrayReference = i - 1;
      var imagePath = imagePaths[arrayReference];
      var newDiv = '<div class="' + lazyLoadClass + ' slider__image" data-src="' + imagePath + '"></div>';
      $(this).after(newDiv);
      //console.log(imagePaths.length);
    }
    // remove the noscript element from the page
    $(this).remove();
  });



  // load in the first image of the set before it comes into the viewport
  var lazyLoadFirstImage = debounce(function() {
    $('.js-slider').each(function() {
      var image = $(this).find('.' + lazyLoadClass + ':first');
      var bottomOfViewport = $(window).scrollTop() + $(window).height();
      var imagePosition = image.offset().top;
      var imagePositionWithOffset = imagePosition - $(window).height();
      if (!(image.hasClass(lazyLoadLoadedClass))) {
        if (bottomOfViewport > imagePositionWithOffset) {
          var imagePath = image.data('src');
          var imageStyleString = 'background-image: url(\'' + imagePath + '\');'
          // insert the background image on the element
          image.attr('style', imageStyleString);
          // mark that this image has loaded
          image.addClass(lazyLoadLoadedClass);
        }
      }
    });
  }, 50);

  // run function on pageload, window scroll & resize
  $(window).on('load', lazyLoadFirstImage);
  $(window).scroll(lazyLoadFirstImage);
  window.addEventListener('resize', lazyLoadFirstImage);

  // add classes to show hide images in each slider
  $('.js-slider').each(function() {
    // find elements
    var imagesWrap = $(this).find('.slider__images');
    var images = imagesWrap.children('.slider__image')
    // loop through each image and apply class, keeping the first visible
    for (var i = 0; i < images.length; i++) {

      if (i === 0) {
        $(images[i]).addClass(sliderVisibleClass);
        //console.log(images[i]);
      } else {
        $(images[i]).addClass(sliderNotVisibleClass);
      }
    }
  });

  // left button click
  $('.js-slider-nav').on('click',function(event) {
    event.preventDefault();

    var slider = $(this).closest('.js-slider');
    var sliderImages = slider.find('.slider__image');
    var sliderImagesNotLoaded = slider.find('.slider__image').not('.' + lazyLoadLoadedClass);

    // are there images to load in?
    if (sliderImagesNotLoaded.length > 0) {
      // loop through unloaded images
      $(sliderImagesNotLoaded).each(function () {
        var imagePath = $(this).data('src');
        var imageStyleString = 'background-image: url(\'' + imagePath + '\');'
        // insert the background image on the element
        $(this).attr('style', imageStyleString);
        // mark that this image has loaded
        $(this).addClass('is-loaded');
      })
    }

    // find elements and data
    var imageClass = '.slider__image';
    var navDirection = $(this).data('slider-nav-direction');
    var currentSlider = $(this).closest('.js-slider');
    var currentImage = currentSlider.find('.' + sliderVisibleClass);
    var nextImage = currentImage.next(imageClass);
    var prevImage = currentImage.prev(imageClass);
    var firstImage = currentSlider.find(imageClass + ':first');
    var lastImage = currentSlider.find(imageClass + ':last');
//console.log(currentImage);
    function showNextImage() {
      if (nextImage.length === 0) {
        // if there is no image, go back to the start
        firstImage.removeClass(sliderNotVisibleClass).addClass(sliderVisibleClass)
      } else {
        nextImage.removeClass(sliderNotVisibleClass).addClass(sliderVisibleClass)
      }
      currentImage.removeClass(sliderVisibleClass).addClass(sliderNotVisibleClass)
    }

    function showPrevImage() {
      if (prevImage.length === 0) {
        // if there is no image, go back to the end
        lastImage.removeClass(sliderNotVisibleClass).addClass(sliderVisibleClass)
      } else {
        prevImage.removeClass(sliderNotVisibleClass).addClass(sliderVisibleClass)
      }
      currentImage.removeClass(sliderVisibleClass).addClass(sliderNotVisibleClass)
    }




    // checks which button has been clicked and runs function
    switch (navDirection) {
      case 'next':
        showNextImage();
        break;
      case 'prev':
        showPrevImage();
        break;
    }
  })

  ///////////////////////////////////////
  //   general debounce
  ///////////////////////////////////////
  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  function debounce(func, wait, immediate) {
  	var timeout;
  	return function() {
  		var context = this, args = arguments;
  		var later = function() {
  			timeout = null;
  			if (!immediate) func.apply(context, args);
  		};
  		var callNow = immediate && !timeout;
  		clearTimeout(timeout);
  		timeout = setTimeout(later, wait);
  		if (callNow) func.apply(context, args);
  	};
  };

});})(jQuery, this); // on ready end
