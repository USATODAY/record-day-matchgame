define(function(){

this["templates"] = this["templates"] || {};

this["templates"]["app.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div id="overallCon" class="group"  >\n    \n    <div id="headerCon">\n        <h1 class="header-title">Celbrity Age Matching Game</h1>\n        <div class="instruct">How long will it take you to get all of these correct? Guess how old each celeb is by dragging their age to their photo.</div>\n        <div class="button" id="begin-button">Begin</div>\n    </div>\n    \n    <!--DRAGGABLE THINGS-->\n    <div id="headCon" class="droppable2 group hide">\n        <div id="instructions"><h2>CELBRITY AGE MATCHING GAME</h2><h3>Drag the correct age to the corresponding celebrity on the right.</h3></div>\n        <div id="scoreCon" class="group ">\n            <div id="timer"><span id="minutes">00</span><span>:</span><span id="seconds">00</span></div>\n                <div class="score">\n                    <div class="score-inner"><div class="numDisp" id="numCorrect">0</div> Correct</div>\n                    <div class="score-inner"><div class="numDisp" id="numAttempts">0</div> Attempts</div>\n                </div>\n            </div>\n    </div>\n\n\n\n\n    \n\n    \n\n    <!--DROP TARGETS-->\n    <div id="targetCon" class="group intro"></div>\n    <!--END DROP TARGETS-->\n\n    <!--TWITTER AND FACEBOOK SHARING-->\n    <div id="shareCon">\n            <p class="congrats">Congratulations, you matched all <span id="totalCorrect">10</span>!</p>\n            <p id="share">It took you 00 attempts to match them all. Share your score!</p>\n            <div class="share group">\n                <a class="tshare" href="javascript: window.open(\'https://twitter.com/intent/tweet?url=http%3A%2F%2Fusatoday30.usatoday.com%2Fexp%2Fnineties%2Findex.html&text=How%20well%20do%20you%20remember%20the%20nineties?%20Check%20out%20our%20stream%20of%20famous%2090s%20moments. &via=usatoday\', \'twitterwindow\', \'height=450, width=550, top=200, left=200, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0\');Analytics.click(\'Twitter share\');void(0);"><img src="img/twitter.png" alt="Share" class="social" border="0"></a>\n                <a class="eshare" href="mailto:?body=How%20well%20do%20you%20remember%20the%20nineties?%20Check%20out%20our%20stream%20of%20famous%2090s%20moments. %0d%0d http%3A%2F%2Fusatoday30.usatoday.com%2Fexp%2Fnineties%2Findex.html&subject=The%20Nineties" onclick="var sharer = window.open(\'http://usatoday30.usatoday.com/_common/_dialogs/fb-share-done.html\',\'sharer\',\'toolbar=0,status=0,width=580,height=400,top=200,left=200\');setTimeout(function() {sharer.close();}, 500);void(0);"><img src="img/email.png" alt="Share" class="social" border="0"></a>\n                <a class="fbshare" href="javascript: var sTop=window.screen.height/2-(218);var sLeft=window.screen.width/2-(313);window.open(\'https://www.facebook.com/dialog/feed?display=popup&app_id=215046668549694&link=http%3A%2F%2Fusatoday30.usatoday.com%2Fexp%2Fnineties%2Findex.html&picture=http://usatoday30.usatoday.com/exp/nineties/img/fb-post.jpg&name=The%20Nineties&description=How%20well%20do%20you%20remember%20the%20nineties?%20Check%20out%20our%20stream%20of%20famous%2090s%20moments.&redirect_uri=http://usatoday30.usatoday.com/_common/_dialogs/fb-share-done.html\',\'sharer\',\'toolbar=0,status=0,width=580,height=400,top=\'+sTop+\',left=\'+sLeft);Analytics.click(\'Facebook share\');void(0);"><img src="img/facebook.png" alt="Share" class="social" border="0"></a>\n          </div>\n\n    </div>\n    <!--END TWITTER AND FACEBOOK SHARING-->\n</div>\n    \n</div>\n\n<div id="landscape-warning">\n\t\t<h2>Please rotate your device.</h2>\n</div>\n\n';

}
return __p
};

this["templates"]["template.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h3>' +
((__t = (test)) == null ? '' : __t) +
'</h3>\n';

}
return __p
};

  return this["templates"];

});