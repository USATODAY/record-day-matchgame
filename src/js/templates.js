define(function(){

this["templates"] = this["templates"] || {};

this["templates"]["app.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div id="overallCon" class="group"  >\n    <div id="headerCon" class="overlay">\n        <h1 class="header-title">USA TODAY RECORD QUIZ</h1>\n        <div class="instruct">For Record Store Day (April 18), see how much you know about classic albums.</div>\n        <h2 class="round-title">Round 1: TOTAL SALES</h2>\n        <div class="instruct">Match the number of units sold (in millions) to the album</div>\n        <div class="button" id="begin-button">Begin</div>\n    </div>\n    <div class="round-container"></div>\n    <!--TWITTER AND FACEBOOK SHARING-->\n    <div id="shareCon">\n            \n    </div>\n    <!--END TWITTER AND FACEBOOK SHARING-->\n</div>\n    \n</div>\n\n<div id="landscape-warning">\n\t\t<h2>Please rotate your device.</h2>\n</div>\n\n';

}
return __p
};

this["templates"]["dragcircle.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'headcircle draggable\' id=\'atest' +
((__t = ( item.id )) == null ? '' : __t) +
'\'>\n    <img src=\'' +
((__t = ( base_path )) == null ? '' : __t) +
'img/yearCircle.svg\'/>\n    <span class=\'year-label\'>' +
((__t = ( item.number)) == null ? '' : __t) +
'</span>\n</div>\n';

}
return __p
};

this["templates"]["dragimage.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'headcircle drag-image draggable\' id=\'atest' +
((__t = ( item.id )) == null ? '' : __t) +
'\'>\n    <img src=\'' +
((__t = ( base_path )) == null ? '' : __t) +
'img/' +
((__t = (item.cover )) == null ? '' : __t) +
'\'/>\n</div>\n';

}
return __p
};

this["templates"]["infopanel.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div id="instructions"><h2>' +
((__t = (info.head)) == null ? '' : __t) +
'</h2><h3>' +
((__t = (info.chatter)) == null ? '' : __t) +
'</h3></div>\n<div id="scoreCon" class="group ">\n<div id="timer"><span class="minutes">00</span><span>:</span><span class="seconds">00</span></div>\n    <div class="score">\n        <div class="score-inner"><div class="numDisp numCorrect" id="numCorrect">0</div> Correct</div>\n        <div class="score-inner"><div class="numDisp numAttempts" id="numAttempts">0</div> Attempts</div>\n    </div>\n</div>\n<div class="drag-wrap"></div>\n';

}
return __p
};

this["templates"]["round.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="round-wrap ' +
((__t = (round)) == null ? '' : __t) +
'">\n    \n    \n    <!--DRAGGABLE THINGS-->\n    <div id="headCon" class="headCon droppable2 group hide">\n        \n    </div>\n\n\n\n\n    \n\n    \n\n    <!--DROP TARGETS-->\n    <div id="targetCon" class="targetCon group intro"></div>\n    <!--END DROP TARGETS-->\n    </div>\n';

}
return __p
};

this["templates"]["roundintro.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="headerCon" class="overlay">\n    <h2 class="round-title">Round ' +
((__t = (round )) == null ? '' : __t) +
': ' +
((__t = ( head )) == null ? '' : __t) +
'</h2>\n    <div class="instruct">' +
((__t = ( chatter )) == null ? '' : __t) +
'</div>\n    <div class="button begin-button-round-button">Go</div>\n</div>\n';

}
return __p
};

this["templates"]["share.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<p class="congrats">Congratulations, you matched them all!</p>\n    <p id="share">It took you 00 attempts to match them all. Share your score!</p>\n    <div class="share group">\n        <a class="tshare social social-popup" href="https://twitter.com/intent/tweet?url=' +
((__t = (twitterShare)) == null ? '' : __t) +
'&text=' +
((__t = (encodedShare)) == null ? '' : __t) +
'"><img src="http://www.gannett-cdn.com/experiments/usatoday/2015/04/record-day/img/twitter.png" alt="Share"  border="0"></a>\n        <a class="eshare social" href="' +
((__t = (email_link)) == null ? '' : __t) +
'" ><img src="http://www.gannett-cdn.com/experiments/usatoday/2015/04/record-day/img/email.png" alt="Share"  border="0"></a>\n        <a class="fbshare social social-popup" href="https://www.facebook.com/dialog/feed?display=popup&app_id=' +
((__t = (fb_id)) == null ? '' : __t) +
'&link=' +
((__t = (fbShare)) == null ? '' : __t) +
'&picture=' +
((__t = (stillimage)) == null ? '' : __t) +
'&name=&description=' +
((__t = (encodedShare)) == null ? '' : __t) +
'&redirect_uri=' +
((__t = (fb_redirect)) == null ? '' : __t) +
'"><img src="http://www.gannett-cdn.com/experiments/usatoday/2015/04/record-day/img/facebook.png" alt="Share"  border="0"></a>\n  </div>\n\n';

}
return __p
};

this["templates"]["target.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'atarget droppable\' id=\'ttest' +
((__t = ( item.id )) == null ? '' : __t) +
'\'>\n    <div class=\'messagewrong\'>\n        <img src =\'' +
((__t = (base_path)) == null ? '' : __t) +
'img/x.svg\'>\n    </div>\n    <div class=\'messageright\'>\n        <img src =\'' +
((__t = (base_path)) == null ? '' : __t) +
'img/check.svg\'>\n    </div>\n    <img src=\'' +
((__t = ( base_path )) == null ? '' : __t) +
'img/' +
((__t = ( item.img )) == null ? '' : __t) +
'\' class=\'bw\'/>\n    <div class =\'target-info\'>' +
((__t = ( item.text )) == null ? '' : __t) +
'\n        <p class=\'result-year\'>' +
((__t = ( item.number )) == null ? '' : __t) +
'</p>\n    </div>\n    <div class=\'source\'>' +
((__t = ( item.targetimgsource )) == null ? '' : __t) +
'</div></div>\n</div>\n';

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

this["templates"]["texttarget.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'atarget droppable text-target\' id=\'ttest' +
((__t = ( item.id )) == null ? '' : __t) +
'\'>\n    <div class=\'messagewrong\'>\n        <img src =\'' +
((__t = (base_path)) == null ? '' : __t) +
'img/x.svg\'>\n    </div>\n    <div class=\'messageright\'>\n        <img src =\'' +
((__t = (base_path)) == null ? '' : __t) +
'img/check.svg\'>\n    </div>\n    <h3 class="target-text">' +
((__t = ( item.album )) == null ? '' : __t) +
'</h3>\n    <div class=\'source\'>' +
((__t = ( item.targetimgsource )) == null ? '' : __t) +
'</div></div>\n</div>\n\n';

}
return __p
};

  return this["templates"];

});