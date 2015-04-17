define(
  [
    'jquery',
    'underscore',
    'templates',
    'api/analytics',
    'config',
    'jquery_ui',
    'jquery_ui_touch_punch'
  ],
  function(jQuery, _, templates, Analytics, config) {

    //set up global variables
    var origXPos = [];
    var origYPos = [];
    var $overallCon = jQuery("#overallCon");
    var matchData;
    var currentRound = 3;
    var roundCorrect = 0;
    var roundAttempts = 0;
    var totalCorrect = 0;
    var totalAttempts = 0;

    var base_path = "http://www.gannett-cdn.com/experiments/usatoday/2015/04/record-day/";

    var shareText = "In honor of Record Store Day (April 18), see how much you know about classic albums.";

    var copy = [
        {
            "head": "Total Sales",
            "chatter": "Match the number of units sold (in millions) to the album* <br>*U.S. sales. Source: RIAA"
        },
        {
            "head": "WEEKS AT NO. 1",
            "chatter": "Match the number of weeks at the top of the sales chart to the album <br> Source: Billboard"
        },
        {
            "head": "MOST NO. 1 ALBUMS",
            "chatter": "Match the number of No. 1 albums to the artist <br> Source: Billboard"
        },
        {
            "head": "CRYPTIC COVERS",
            "chatter": "Match the album cover to the album title"
        }
    ];

    var matchGameObj = matchGameObj || {};
        matchGameObj.correct = 0;
        matchGameObj.attempts = 0;
        matchGameObj.isCounting = true;
        matchGameObj.seconds = 0;
        matchGameObj.minutes = 0;



    //define shuffle function
    matchGameObj.shuffle = function(array) {
      var currentIndex = array.length;
      var temporaryValue;
      var randomIndex;
      
      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    };

    //define timer function
    matchGameObj.countTime = function() {
      
      $seconds = $('.seconds');
      $minutes = $('.minutes');

      //default timelimit is 10 minutes
      var timeLimit = 10; 

      if (!matchGameObj.isCounting) { 
        clearInterval(matchGameObj.interval); 
        return;
      }
      
      matchGameObj.interval = setInterval(function () {
        ++matchGameObj.seconds;
        if (matchGameObj.seconds < 10) {
          $seconds.html("0" + matchGameObj.seconds);
        }
        else if (matchGameObj.seconds === 60) {
          $seconds.html("00");
        }

        else if (matchGameObj.seconds >= 10) {
          $seconds.html(matchGameObj.seconds);
        }
        
        if (matchGameObj.seconds == 60) {
          ++matchGameObj.minutes;
          if (matchGameObj.minutes < 10) {
            $minutes.html("0" + matchGameObj.minutes);
          }
          else if (matchGameObj.minutes >= 10) {
             $minutes.html(matchGameObj.minutes);
          }
          matchGameObj.seconds = 0;
        }
        if (!matchGameObj.isCounting || matchGameObj.minutes >= timeLimit) { 
          clearInterval(myInterval); 
        }
      }, 1000);
    };

    matchGameObj.renderDrag = function(data) {

        matchGameObj.dragCon.html(templates["infopanel.html"]({info: copy[currentRound]}));

        matchGameObj.shuffle(data);
    //setup draggable area
      for (var i = 0; i <  data.length; i++) {
          var item = data[i];
          var context = {
            item: item,
            base_path: base_path
          };
          if (currentRound < 3) {
            matchGameObj.dragCon.find('.drag-wrap').append(templates["dragcircle.html"](context));
          } else {
            matchGameObj.dragCon.find('.drag-wrap').append(templates["dragimage.html"](context));
          }
      }
    };

    matchGameObj.renderTarget = function(data) {
        matchGameObj.targetCon.empty();

        matchGameObj.shuffle(data);
        for (var c = 0; c <  data.length; c++) {
            var item = data[c];
            var context = {
              item: item,
              base_path: base_path
            };
            if (currentRound < 3) {
                matchGameObj.targetCon.append(templates["target.html"](context));
            } else {
                matchGameObj.targetCon.append(templates["texttarget.html"](context));
            }
        }
    };

    matchGameObj.startRound = function(data) {
        roundCorrect = 0;
        roundAttempts = 0;
        matchGameObj.minutes = 0;
        matchGameObj.seconds= 0;
        $(".round-container").append(templates["round.html"]({round: currentRound}));

        var selector = ".round-wrap." + currentRound;
        matchGameObj.$roundWrap = $(selector);
        matchGameObj.dragCon = matchGameObj.$roundWrap.find(".headCon");
        matchGameObj.targetCon = matchGameObj.$roundWrap.find(".targetCon");
      

        matchGameObj.renderDrag(data);

     
        //setup target area
        matchGameObj.renderTarget(data);
       
        //scramble starting positions of drag circles
        matchGameObj.scrableStartPositions(".headcircle");
        $(".atarget > img").load(function(e) {
            matchGameObj.imgRatio(matchGameObj.$roundWrap);
        });

        if (currentRound > 0) {
            matchGameObj.animateCircles(matchGameObj.dragCon);
            matchGameObj.dragCon.removeClass("hide");
            matchGameObj.targetCon.removeClass("intro");
            matchGameObj.countTime();
            var introAnimationInterval = window.setInterval(function() {
                matchGameObj.imgRatio(matchGameObj.$roundWrap);
            }, 5);

            window.setTimeout(function() {
                window.clearInterval(introAnimationInterval);
            }, 750);
        }
        //make things draggable and droppable
      $( ".draggable" ).draggable({ revert: true });

      $( ".droppable" ).droppable({
        hoverClass: "boxHover",
        drop: function( event, ui ) {
          Analytics.trackEvent("Attempted match");
          $( this );
           var dragid = ui.draggable.attr("id").substring(1, ui.draggable.attr("id").length);
           var dropid = $(this).attr("id").substring(1, $(this).attr("id").length);
           var dataid = $(this).attr("data-id");


           // check if guess is correct
           if (dragid == dropid) { console.log("correct"); matchGameObj.correctGuess(dragid, dropid, ui);} 

           //run if guess is wrong
           else { console.log("incorrect"); matchGameObj.incorrectGuess(dropid); }
        }
      });


    };

    // set up celebrity match game function
    matchGameObj.gameInit = function() {

      data = matchData[currentRound];

      //set up object variables
      matchGameObj.shareCon = jQuery("#shareCon");
            
      matchGameObj.startRound(data);

            //hide Share untill the end
      matchGameObj.shareCon.hide();

      matchGameObj.addEventListeners();


    }; 

    matchGameObj.nextRound = function() {
        matchGameObj.$roundWrap.hide();
        currentRound ++;
        data = matchData[currentRound];

        clearInterval(matchGameObj.interval);

        matchGameObj.startRound(data);
    };

    matchGameObj.scrableStartPositions = function(selector) {
      $selector = $(selector);
      startingHeight = - window.innerHeight;
      $selector.css("top", startingHeight + "px");
    };

    matchGameObj.animateCircles = function($parent){
      $headCircles = $parent.find(".headcircle");
      for (i = 0; i < $headCircles.length; i ++) {
        var $current = $($headCircles[i]);
        $current.animate({top: 0}, 1000 + 250 * i, "easeOutBounce");
      }
      
    };

    matchGameObj.correctGuess = function(dragid, dropid, element) {
      $numAttempts = $('.numAttempts');
      $numCorrect = $('.numCorrect');


      matchGameObj.$roundWrap.find("#" + dragid + "inside").css("display", "block");
      matchGameObj.$roundWrap.find("#t" + dropid + " .messageright").css("display", "inline").delay(1500).fadeOut( "slow" );
      matchGameObj.$roundWrap.find("#t" + dropid).addClass('correct');
      element.draggable.css("visibility", "hidden");
      var currentImg = matchGameObj.$roundWrap.find("#t" + dropid).find("img");
      var currentName = matchGameObj.$roundWrap.find("#t" + dropid).find(".target-info");
      currentName.addClass("correct");
      currentImg.removeClass("bw");
      // matchGameObj.attempts ++;
      roundAttempts ++;
      roundCorrect ++;
      totalAttempts ++;
      totalCorrect ++;
      // matchGameObj.correct ++;
      $numAttempts.text(roundAttempts);
      $numCorrect.text(roundCorrect);

      //set correct time units for the finished message
      var timeUnits = {
        minutes: "minutes",
        seconds: "seconds"
      };

      if (matchGameObj.minutes == 1) {
        timeUnits.minutes = "minute";
      }

      if (matchGameObj.seconds == 1) {
        timeUnits.seconds = "second";
      }

      //check if game is complete
      if (roundCorrect == matchData[currentRound].length) {
        if (currentRound == matchData.length - 1) {
            matchGameObj.gameCompleted(timeUnits);
        } else {
            _.delay(matchGameObj.nextRound, 500);
        }
      }
    };

    matchGameObj.incorrectGuess = function(dropid) {
      $numAttempts = $('.numAttempts');

      matchGameObj.$roundWrap.find("#t" + dropid + " .messagewrong").css("display", "inline").delay(1500).fadeOut( "slow" );
      roundAttempts ++;
      totalAttempts ++;
      $numAttempts.text(roundAttempts);
    };

    matchGameObj.gameCompleted = function(timeUnits) {
      Analytics.trackEvent("Completed Game");
      //stop timer
      matchGameObj.isCounting = false;

      //set total correct box to equal the total
      $("#totalCorrect").text(roundCorrect);

      //set finished message to display
      if (matchGameObj.minutes == 10){
         $("#share").html("It took you " + totalAttempts + " attempts and more than 10 minutes to match them all.");
      }
      else {
        $("#share").html("It took you " + totalAttempts + " attempts to match them all.");
      }

      
      
      //Show Share options, fade main content
      
      $("#headCon").addClass("hide");
      $("#targetCon").addClass("intro");
      $("#shareCon").fadeIn(100);

      var introAnimationInterval = window.setInterval(function() {
        matchGameObj.imgRatio(matchGameObj.$roundWrap);
      }, 5);

      window.setTimeout(function() {
          window.clearInterval(introAnimationInterval);
        }, 750);
      
    };


    matchGameObj.imgRatio = function($el) {
        var imgs = $el.find(".atarget > img");
        var targets = $el.find(".atarget");

        console.log(imgs.length);

        
        for (var i = 0; i < targets.length; i++) {
          var w = targets.outerWidth();
          var h = targets.outerHeight();
          var correctRatio = imgs[i].naturalHeight/imgs[i].naturalWidth;


          if ( (h / w) > correctRatio) {
            correctWidth = h / correctRatio;
            offset = (correctWidth - w) / 2;

            imgs.css("max-width", "none");
            imgs.css("height", h);
            imgs.css("width", correctWidth);
            imgs.css("margin-left", -offset);
          }
          else {
            imgs.css("margin-left", "0");
            imgs.css("width", w);
            imgs.css("height", "auto");
          }
        }
        
        
        // var h = elm.outerHeight();
      };


    matchGameObj.startGame = function() {
      //start timer
      matchGameObj.countTime();


      $("#headerCon").fadeOut(100);


      $("#headCon").removeClass("hide");
      $("#targetCon").removeClass("intro");

      var introAnimationInterval = window.setInterval(function() {
        matchGameObj.imgRatio(matchGameObj.$roundWrap);
      }, 5);

      window.setTimeout(function() {
          window.clearInterval(introAnimationInterval);
        }, 750);
      

      window.setTimeout(function() {
        matchGameObj.animateCircles($('.headCon'));
      }, 800);

      
    };

    matchGameObj.addEventListeners = function() {
      $("#begin-button").on("click", function() {
        matchGameObj.startGame(); 
      });

      $(window).on('resize', function() {
        matchGameObj.checkOrientation();
      });

      $('.social-popup').on('click', matchGameObj.socialClick);
    };

    matchGameObj.checkOrientation = function() {
      var width = $(window).width();
      var height = $(window).height();

      var isLandscape = function() {
        if (width > height) {
          return true;
        }

        else {
          return false;
        }
      };
      if(config.isMobile && isLandscape() && width < 900) {

        //do landscape stuff here
        $("body").addClass("landscape");
      }

      else {
        $("body").removeClass("landscape");
      }

    };

    matchGameObj.headerFix = function() {
      console.log("called");
      var width = $(window).width();
      if(config.isMobile && width < 700) {
        console.log("header");
        $("#header").height(50);
      }
    };

    matchGameObj.init = function() {
        console.log(Analytics);
        var hostname = window.location.hostname;

        var dataURL;

        if ((hostname == "localhost" || hostname == "10.0.2.2")) {
            dataURL = 'data/data.json';
        } else {
            dataURL = "http://" + hostname + "/services/webproxy/?url=http://www.gannett-cdn.com/experiments/usatoday/2015/04/festivals/data/data.json";
        }


        $.getJSON(dataURL, function(data) {
            matchData = data.games;
            $('.iapp-wrap').html(templates["app.html"]());
            $('#shareCon').html(templates["share.html"](matchGameObj.createShare(shareText)));

            matchGameObj.gameInit();
            matchGameObj.checkOrientation();

            var blnIframeEmbed = window != window.parent;
            if (blnIframeEmbed) {
              jQuery("#header").css({"display" : "none"});
              jQuery("#headCon").css("margin-top", "0"); 

              var imgs = $(".atarget > img");

              imgs.css("margin-top", "-20%");
            }
        });
        
    };

    $(window).resize(function() {
      matchGameObj.imgRatio(matchGameObj.$roundWrap);
    });
    
    matchGameObj.createShare = function(shareString) {
        var shareURL = window.location.href;
        var fbShareURL = encodeURI(shareURL.replace('#', '%23'));
        var twitterShareURL = encodeURIComponent(shareURL);
        var emailLink = "mailto:?body=" + encodeURIComponent(shareString) +  "%0d%0d" + twitterShareURL + "&subject=";
        
        return {
            'fb_id': config.facebook.app_id,
            fbShare:  encodeURI(shareURL.replace('#', '%23')),
            stillimage: base_path + "img/fb-post.jpg",
            encodedShare: encodeURIComponent(shareString),
            fb_redirect: 'http://' + window.location.hostname + '/pages/interactives/fb-share/',
            email_link: "mailto:?body=" + encodeURIComponent(shareString) +  "%0d%0d" + encodeURIComponent(shareURL) + "&subject=",
            twitterShare: encodeURIComponent(shareURL)
        };

    };

    matchGameObj.socialClick = function(e) {
        e.preventDefault();
        Analytics.trackEvent('Share button clicked: ' + jQuery(e.currentTarget).attr('id'));

        matchGameObj.windowPopup(e.currentTarget.href, 500, 300);
    };

    matchGameObj.windowPopup = function(url, width, height) {
        // Calculate the position of the popup so
        // it’s centered on the screen.
        var left = (screen.width / 2) - (width / 2),
        top = (screen.height / 2) - (height / 2);

        window.open(
            url,
            "",
            "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left
        );
    };


    return matchGameObj;

});
