//Smooth Scrolling, menu toggling, email functions, etc.
(function($) {
    "use strict";
    var cfg = {
        scrollDuration: 800,
        mailChimpURL: 'https://facebook.us8.list-manage.com/subscribe/post?u=cdb7b577e41181934ed6a6a44&amp;id=e6957d85dc'
    }
      , $WIN = $(window);
    var doc = document.documentElement;
    doc.setAttribute('data-useragent', navigator.userAgent);
    var clPreloader = function() {
        $("html").addClass('cl-preload');
        $WIN.on('load', function() {
            $("#loader").fadeOut("slow", function() {
                $("#preloader").delay(300).fadeOut("slow");
            });
            $("html").removeClass('cl-preload');
            $("html").addClass('cl-loaded');
        });
    };
    var clMenuOnScrolldown = function() {
        var menuTrigger = $('.header-menu-toggle');
        $WIN.on('scroll', function() {
            if ($WIN.scrollTop() > 150) {
                menuTrigger.addClass('opaque');
            } else {
                menuTrigger.removeClass('opaque');
            }
        });
    };
    var clOffCanvas = function() {
        var menuTrigger = $('.header-menu-toggle')
          , nav = $('.header-nav')
          , closeButton = nav.find('.header-nav__close')
          , siteBody = $('body')
          , mainContents = $('section, footer');
        menuTrigger.on('click', function(e) {
            e.preventDefault();
            siteBody.toggleClass('menu-is-open');
        });
        closeButton.on('click', function(e) {
            e.preventDefault();
            menuTrigger.trigger('click');
        });
        siteBody.on('click', function(e) {
            if (!$(e.target).is('.header-nav, .header-nav__content, .header-menu-toggle, .header-menu-toggle span')) {
                siteBody.removeClass('menu-is-open');
            }
        });
    };
    var clSmoothScroll = function() {
        $('.smoothscroll').on('click', function(e) {
            var target = this.hash
              , $target = $(target);
            e.preventDefault();
            e.stopPropagation();
            $('html, body').stop().animate({
                'scrollTop': $target.offset().top
            }, cfg.scrollDuration, 'swing').promise().done(function() {
                if ($('body').hasClass('menu-is-open')) {
                    $('.header-menu-toggle').trigger('click');
                }
                window.location.hash = target;
            });
        });
    };
    var clAOS = function() {
        AOS.init({
            offset: 200,
            duration: 500,
            easing: 'ease-in-sine',
            delay: 100,
            once: true,
            disable: 'mobile'
        });
    };
    (function ssInit() {
        clPreloader();
        clMenuOnScrolldown();
        clOffCanvas();
        clSmoothScroll();
        clAOS();
    }
    )();
}
)(jQuery);