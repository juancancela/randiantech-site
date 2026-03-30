(function () {
  function getAccentColor() {
    var style = getComputedStyle(document.documentElement);
    var accent = style.getPropertyValue("--color-accent").trim();
    if (!accent) return { r: 59, g: 130, b: 246 };
    var p = accent.split(",").map(function (s) { return parseInt(s.trim(), 10); });
    return { r: p[0] || 59, g: p[1] || 130, b: p[2] || 246 };
  }

  function initCircuit(canvasId) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var width, height;
    var nodes = [];
    var paths = [];
    var pulses = [];
    var animId;

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      generate();
    }

    function generate() {
      nodes = [];
      paths = [];
      pulses = [];
      var cols = Math.ceil(width / 80);
      var rows = Math.ceil(height / 80);
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          if (Math.random() > 0.35) continue;
          nodes.push({
            x: c * 80 + 40 + (Math.random() - 0.5) * 20,
            y: r * 80 + 40 + (Math.random() - 0.5) * 20,
            size: 1.5 + Math.random() * 2,
          });
        }
      }
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx = nodes[i].x - nodes[j].x;
          var dy = nodes[i].y - nodes[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140 && Math.random() > 0.5) {
            paths.push({ a: i, b: j, dist: dist });
          }
        }
      }
      for (var k = 0; k < Math.min(paths.length, 8); k++) {
        var pi = Math.floor(Math.random() * paths.length);
        pulses.push({
          pathIdx: pi,
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.004,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      var ac = getAccentColor();
      var ar = ac.r, ag = ac.g, ab = ac.b;

      for (var i = 0; i < paths.length; i++) {
        var p = paths[i];
        var na = nodes[p.a];
        var nb = nodes[p.b];
        var dx = Math.abs(na.x - nb.x);
        var dy = Math.abs(na.y - nb.y);
        ctx.beginPath();
        if (dx > dy) {
          var midX = (na.x + nb.x) / 2;
          ctx.moveTo(na.x, na.y);
          ctx.lineTo(midX, na.y);
          ctx.lineTo(midX, nb.y);
          ctx.lineTo(nb.x, nb.y);
        } else {
          var midY = (na.y + nb.y) / 2;
          ctx.moveTo(na.x, na.y);
          ctx.lineTo(na.x, midY);
          ctx.lineTo(nb.x, midY);
          ctx.lineTo(nb.x, nb.y);
        }
        ctx.strokeStyle = "rgba(" + ar + "," + ag + "," + ab + ",0.06)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      for (var ni = 0; ni < nodes.length; ni++) {
        var n = nodes[ni];
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + ar + "," + ag + "," + ab + ",0.12)";
        ctx.fill();
        ctx.beginPath();
        ctx.rect(n.x - 3, n.y - 3, 6, 6);
        ctx.strokeStyle = "rgba(" + ar + "," + ag + "," + ab + ",0.08)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      for (var pi = 0; pi < pulses.length; pi++) {
        var pulse = pulses[pi];
        pulse.progress += pulse.speed;
        if (pulse.progress > 1) pulse.progress = 0;
        var path = paths[pulse.pathIdx];
        if (!path) continue;
        var pa = nodes[path.a];
        var pb = nodes[path.b];
        var t = pulse.progress;
        var px = pa.x + (pb.x - pa.x) * t;
        var py = pa.y + (pb.y - pa.y) * t;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + ar + "," + ag + "," + ab + ",0.4)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + ar + "," + ag + "," + ab + ",0.08)";
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    var observer = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          if (!animId) draw();
        } else {
          if (animId) { cancelAnimationFrame(animId); animId = null; }
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(canvas);
    draw();
  }

  function initAll() {
    var canvases = document.querySelectorAll("[data-circuit-bg]");
    canvases.forEach(function (c) { initCircuit(c.id); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
  document.addEventListener("astro:after-swap", initAll);
})();
