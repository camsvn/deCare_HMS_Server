//based on https://dribbble.com/shots/3913847-404-page

// var pageX = $(document).width();
// var pageY = $(document).height();
var pageX = document.documentElement.clientWidth;
var pageY = document.documentElement.clientHeight;
var mouseY=0;
var mouseX=0;

$(window).mousemove(function( event ) {
  //verticalAxis
  mouseY = event.pageY;
  yAxis = (pageY/2-mouseY)/pageY*300;
  //confining verticalAxis to ghost container
  yAxis = yAxis < 0 ? 0 : yAxis;

  //horizontalAxis
  mouseX = event.pageX / -pageX;
  xAxis = -mouseX * 100 - 100;
  //confining horizontalAxis to ghost container
  xAxis = xAxis < -75 ? -75 : xAxis > -25 ? -25 : xAxis;

  $('.box__ghost-eyes').css({ 'transform': 'translate('+ xAxis +'%,-'+ yAxis +'%)' });
});