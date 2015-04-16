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
  function(jQuery, _, templates, Analytics, config){

    //set up global variables
    var origXPos = [];
    var origYPos = [];
    var $overallCon = jQuery("#overallCon");
    var matchData;
    var currentRound = 0;
    var roundCorrect = 0;
    var roundAttempts = 0;

    var base_path = "http://www.gannett-cdn.com/experiments/usatoday/2015/04/record-day/"

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
      

      //default timelimit is 10 minutes
      var timeLimit = 10; 

      if (!matchGameObj.isCounting) { 
        clearInterval(myInterval); 
        return;
      }
      
      var myInterval = setInterval(function () {
        ++matchGameObj.seconds;
        if (matchGameObj.seconds < 10) {
          $("#seconds").html("0" + matchGameObj.seconds);
        }
        else if (matchGameObj.seconds === 60) {
          $("#seconds").html("00");
        }

        else if (matchGameObj.seconds >= 10) {
          $("#seconds").html(matchGameObj.seconds);
        }
        
        if (matchGameObj.seconds == 60) {
          ++matchGameObj.minutes;
          if (matchGameObj.minutes < 10) {
            $("#minutes").html("0" + matchGameObj.minutes);
          }
          else if (matchGameObj.minutes >= 10) {
             $("#minutes").html(matchGameObj.minutes);
          }
          matchGameObj.seconds = 0;
        }
        if (!matchGameObj.isCounting || matchGameObj.minutes >= timeLimit) { 
          clearInterval(myInterval); 
        }
      }, 1000);
    };

    matchGameObj.renderDrag = function(data) {

        matchGameObj.dragCon.html(templates["infopanel.html"]());

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
            }
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
            matchGameObj.imgRatio();
        });

        if (currentRound > 0) {
            matchGameObj.animateCircles();
             matchGameObj.dragCon.removeClass("hide");
            matchGameObj.targetCon.removeClass("intro");
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

      data = matchData[currentRound]

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

        matchGameObj.startRound(data);
    }

    matchGameObj.scrableStartPositions = function(selector) {
      $selector = $(selector);
      startingHeight = - window.innerHeight;
      $selector.css("top", startingHeight + "px");
    };

    matchGameObj.animateCircles = function(){
      $headCircles = $(".headcircle");
      for (i = 0; i < $headCircles.length; i ++) {
        var $current = $($headCircles[i]);
        $current.animate({top: 0}, 1000 + 250 * i, "easeOutBounce");
      }
      
    };

    matchGameObj.correctGuess = function(dragid, dropid, element) {
      $("#" + dragid + "inside").css("display", "block");
      $("#t" + dropid + " .messageright").css("display", "inline").delay(1500).fadeOut( "slow" );
      element.draggable.css("visibility", "hidden");
      var currentImg = $("#t" + dropid).find("img");
      var currentName = $("#t" + dropid).find(".target-info");
      currentName.addClass("correct");
      currentImg.removeClass("bw");
      // matchGameObj.attempts ++;
      roundAttempts ++;
      roundCorrect ++;
      // matchGameObj.correct ++;
      $("#numAttempts").text(roundAttempts);
      $("#numCorrect").text(roundCorrect);

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
      $("#t" + dropid + " .messagewrong").css("display", "inline").delay(1500).fadeOut( "slow" );
      roundAttempts ++;
      $("#numAttempts").text(roundAttempts);
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
        matchGameObj.imgRatio();
      }, 5);

      window.setTimeout(function() {
          window.clearInterval(introAnimationInterval);
        }, 750);
      
    };


    matchGameObj.imgRatio = function() {
        var imgs = $(".atarget > img");
        var targets = $(".atarget");

        
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
        matchGameObj.imgRatio();
      }, 5);

      window.setTimeout(function() {
          window.clearInterval(introAnimationInterval);
        }, 750);
      

      window.setTimeout(function() {
        matchGameObj.animateCircles();
      }, 800);

      
    };

    matchGameObj.addEventListeners = function() {
      $("#begin-button").on("click", function() {
        matchGameObj.startGame(); 
      });

      $(window).on('resize', function() {
        matchGameObj.checkOrientation();
      });
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
      matchGameObj.imgRatio();
    });


    return matchGameObj;

});
