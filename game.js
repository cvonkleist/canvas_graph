var ctx;
var intervalId;
var WIDTH, HEIGHT; // of canvas
var MIN, MAX; // of data values
var XSCALE, YSCALE; // cached form of xScale() and yScale()

var data = [];
var color = [];

function randomizeData() {
  var i, j;
  for(i = 0; i < 3; i++) {
    data[i] = [];
    color[i] = pickRandomColor();
    for(j = 0; j < 10000; j++) {
      data[i][j] = Math.random() * 500;
    }
  }
}

// returns a string like #123
function pickRandomColor() {
  var rgb = [], color;
  for(i = 0; i < 3; i++)
    rgb[i] = Math.floor(Math.random() * 256);
  color = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
  return color;
}

function init() {
  var canvas = $('#canvas');
  ctx = canvas[0].getContext("2d");
  WIDTH = canvas.width();
  HEIGHT = canvas.height();

  clear();
  randomizeData();
  cacheMinMax();
  cacheXYScale();
  draw();
}

function draw() {
  var x, y, lastX;
  data.forEach(function(series, s) {
    ctx.strokeStyle = color[s];
    ctx.beginPath();
    lastX = -1;
    series.forEach(function(val, i) {
      x = i * XSCALE; y = HEIGHT - (val - MIN) * YSCALE;
      if(x - lastX >= 1) {
        if(i == 0)
          ctx.moveTo(x, y);
        else
          ctx.lineTo(x, y);
        lastX = x;
      }
    });
    ctx.stroke();
    ctx.closePath();
  });
}

// returns [min, max] for combined data series
function minMax() {
  var min = data[0][0], max = data[0][0];
  data.forEach(function(series) {
    series.forEach(function(val) {
      min = Math.min(min, val);
      max = Math.max(max, val);
    })
  });
  return [min, max];
}
function cacheMinMax() {
  var mm = minMax();
  MIN = mm[0];
  MAX = mm[1];
}


// returns the appropriate scaling coefficient for x values for turning a data
// index into an x coordinate
function xScale() {
  return WIDTH / (maxLength() - 1);
}

// returns the appropriate scaling coefficient for y values for turning a data
// value into a y coordinate
function yScale() {
  var min, max;
  if(MAX - MIN == 0) return 0;
  return HEIGHT / (MAX - MIN);
}

function cacheXYScale() {
  XSCALE = xScale();
  YSCALE = yScale();
}

// returns the length of the longest data series
function maxLength() {
  var max = data[0].length;
  data.forEach(function(series) {
    max = Math.max(max, series.length);
  });
  return max;
}

// clear entire screen
function clear() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

init();
