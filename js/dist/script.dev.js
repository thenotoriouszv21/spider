"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var w, h;
var ctx = canvas.getContext("2d");
var sin = Math.sin,
    cos = Math.cos,
    PI = Math.PI,
    hypot = Math.hypot,
    min = Math.min,
    max = Math.max;

function spawn() {
  var pts = many(333, function () {
    return {
      x: rnd(innerWidth),
      y: rnd(innerHeight),
      len: 0,
      r: 0
    };
  });
  var pts2 = many(9, function (i) {
    return {
      x: cos(i / 9 * PI * 2),
      y: sin(i / 9 * PI * 2)
    };
  });
  var seed = rnd(100);
  var tx = rnd(innerWidth);
  var ty = rnd(innerHeight);
  var x = rnd(innerWidth);
  var y = rnd(innerHeight);
  var kx = rnd(0.5, 0.5);
  var ky = rnd(0.5, 0.5);
  var walkRadius = pt(rnd(50, 50), rnd(50, 50));
  var r = innerWidth / rnd(100, 150);

  function paintPt(pt) {
    pts2.forEach(function (pt2) {
      if (!pt.len) return;
      drawLine(lerp(x + pt2.x * r, pt.x, pt.len * pt.len), lerp(y + pt2.y * r, pt.y, pt.len * pt.len), x + pt2.x * r, y + pt2.y * r);
    });
    drawCircle(pt.x, pt.y, pt.r);
  }

  return {
    follow: function follow(x, y) {
      tx = x;
      ty = y;
    },
    tick: function tick(t) {
      var selfMoveX = cos(t * kx + seed) * walkRadius.x;
      var selfMoveY = sin(t * ky + seed) * walkRadius.y;
      var fx = tx + selfMoveX;
      var fy = ty + selfMoveY;
      x += min(innerWidth / 100, (fx - x) / 10);
      y += min(innerWidth / 100, (fy - y) / 10);
      var i = 0;
      pts.forEach(function (pt) {
        var dx = pt.x - x,
            dy = pt.y - y;
        var len = hypot(dx, dy);
        var r = min(2, innerWidth / len / 5);
        pt.t = 0;
        var increasing = len < innerWidth / 10 && i++ < 8;
        var dir = increasing ? 0.1 : -0.1;

        if (increasing) {
          r *= 1.5;
        }

        pt.r = r;
        pt.len = max(0, min(pt.len + dir, 1));
        paintPt(pt);
      });
    }
  };
}

var spiders = many(2, spawn);
addEventListener("pointermove", function (e) {
  spiders.forEach(function (spider) {
    spider.follow(e.clientX, e.clientY);
  });
});
requestAnimationFrame(function anim(t) {
  if (w !== innerWidth) w = canvas.width = innerWidth;
  if (h !== innerHeight) h = canvas.height = innerHeight;
  ctx.fillStyle = "#000";
  drawCircle(0, 0, w * 10);
  ctx.fillStyle = ctx.strokeStyle = "#fff";
  t /= 1000;
  spiders.forEach(function (spider) {
    return spider.tick(t);
  });
  requestAnimationFrame(anim);
});

function recalc(X, Y) {
  tx = X;
  ty = Y;
}

function rnd() {
  var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  var dx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return Math.random() * x + dx;
}

function drawCircle(x, y, r, color) {
  //console.log(x,y,r)
  // ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, r, r, 0, 0, PI * 2);
  ctx.fill();
}

function drawLine(x0, y0, x1, y1) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  many(100, function (i) {
    i = (i + 1) / 100;
    var x = lerp(x0, x1, i);
    var y = lerp(y0, y1, i);
    var k = noise(x / 5 + x0, y / 5 + y0) * 2;
    ctx.lineTo(x + k, y + k);
  });
  ctx.stroke();
}

function many(n, f) {
  return _toConsumableArray(Array(n)).map(function (_, i) {
    return f(i);
  });
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function noise(x, y) {
  var t = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 101;
  var w0 = sin(0.3 * x + 1.4 * t + 2.0 + 2.5 * sin(0.4 * y + -1.3 * t + 1.0));
  var w1 = sin(0.2 * y + 1.5 * t + 2.8 + 2.3 * sin(0.5 * x + -1.2 * t + 0.5));
  return w0 + w1;
}

function pt(x, y) {
  return {
    x: x,
    y: y
  };
}
//# sourceMappingURL=script.dev.js.map
