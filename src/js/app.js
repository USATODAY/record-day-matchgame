define(
  [
    'jquery',
    'underscore',
    'templates'
  ],
  function(jQuery, _, templates){

    //set up global variables
    var origXPos = [];
    var origYPos = [];
    var $overallCon = jQuery("#overallCon");

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

    // set up celebrity match game function
    matchGameObj.celebsInit = function() {

      //dummy data if tabletop not used
      if (!matchGameObj.celebData) {
        //set up celebrity data
          matchGameObj.celebData = matchData;
      }


      //set up object variables
      matchGameObj.shareCon = jQuery("#shareCon");
      matchGameObj.dragCon = jQuery("#headCon");
      matchGameObj.targetCon = jQuery("#targetCon");

      //shuffle data
      matchGameObj.shuffle( matchGameObj.celebData);

      //setup draggable area
      for (var i = 0; i <  matchGameObj.celebData.length; i++) {
        matchGameObj.dragCon.append("<div class='headcircle draggable' id =atest" +  matchGameObj.celebData[i].id + ">" +
                          "<img src='img/yearCircle.svg'/>" +  
                          "<span class='year-label'>" + matchGameObj.celebData[i].age + "</span></div>");
      }

      //shuffle data again
      matchGameObj.shuffle( matchGameObj.celebData);
     
      //setup target area
      for (var c = 0; c <  matchGameObj.celebData.length; c++) {
        matchGameObj.targetCon.append("<div class='atarget droppable' id='ttest" +  matchGameObj.celebData[c].id + "'>" + 
                          "<div class='messagewrong'><img src ='img/x.svg'></div>" + 
                          "<div class='messageright'><img src ='img/check.svg'></div><img src='img/" +  matchGameObj.celebData[c].img + "' class='bw'/>" + 
                          "<div class ='target-info'>" + matchGameObj.celebData[c].name + "<p class='result-year'>" +  matchGameObj.celebData[c].age + "</p></div>" + 
                          "<div class='source'>" + matchGameObj.celebData[c].targetimgsource + "</div></div></div>");
      }

      //hide Share untill the end
      matchGameObj.shareCon.hide();

      matchGameObj.addEventListeners();

      //scramble starting positions of drag circles
      matchGameObj.scrableStartPositions(".headcircle");

      $(".atarget > img").load(function(e) {
        matchGameObj.imgRatio();
      });

      $(window).trigger("readyToGo");

    }; 

    matchGameObj.scrableStartPositions = function(selector) {
      $selector = $(selector);
      startingHeight = - 100;
      $selector.css("top", startingHeight + "%");
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
      matchGameObj.attempts ++;
      matchGameObj.correct ++;
      $("#numAttempts").text(matchGameObj.attempts);
      $("#numCorrect").text(matchGameObj.correct);

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
      if (matchGameObj.correct == matchGameObj.celebData.length) {
        matchGameObj.gameCompleted(timeUnits);
      }
    };

    matchGameObj.incorrectGuess = function(dropid) {
      $("#t" + dropid + " .messagewrong").css("display", "inline").delay(1500).fadeOut( "slow" );
      matchGameObj.attempts ++;
      $("#numAttempts").text(matchGameObj.attempts);
    };

    matchGameObj.gameCompleted = function(timeUnits) {
      Analytics.click("Completed Game");
      //stop timer
      matchGameObj.isCounting = false;

      //set total correct box to equal the total
      $("#totalCorrect").text(matchGameObj.correct);

      //set finished message to display
      if (matchGameObj.minutes == 10){
         $("#share").html("It took you " + matchGameObj.attempts + " attempts and more than 10 minutes to match them all.");
      }
      else {
        $("#share").html("It took you " + matchGameObj.attempts + " attempts and " + matchGameObj.minutes + " " +  timeUnits.minutes + " " + matchGameObj.seconds + " " + timeUnits.seconds + " to match them all.");
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

      //make things draggable and droppable
      $( ".draggable" ).draggable({ revert: true });

      $( ".droppable" ).droppable({
        hoverClass: "boxHover",
        drop: function( event, ui ) {
          Analytics.click("Attempted match");
          $( this );
           var dragid = ui.draggable.attr("id").substring(1, ui.draggable.attr("id").length);
           var dropid = $(this).attr("id").substring(1, $(this).attr("id").length);
           var dataid = $(this).attr("data-id");

           // check if guess is correct
           if (dragid == dropid) { matchGameObj.correctGuess(dragid, dropid, ui);} 

           //run if guess is wrong
           else { matchGameObj.incorrectGuess(dropid); }
        }
      });

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
      if(Modernizr.touch && isLandscape() && width < 900) {

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
      if(Modernizr.touch && width < 700) {
        console.log("header");
        $("#header").height(50);
      }
    };

    matchGameObj.init = function() {

        matchGameObj.celebsInit();
        matchGameObj.checkOrientation();
        matchGameObj.headerFix();

        var blnIframeEmbed = window != window.parent;
        if (blnIframeEmbed) {
          jQuery("#header").css({"display" : "none"});
          jQuery("#headCon").css("margin-top", "0"); 

          var imgs = $(".atarget > img");

          imgs.css("margin-top", "-20%");
        }
    };

    $(window).resize(function() {
      matchGameObj.imgRatio();
    });


    return matchGameObj;

});
