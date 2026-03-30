(function () {
  function initGlobe() {
    var canvas = document.getElementById("hero-globe");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var width, height, cx, cy, radius;
    var rotX = -0.3;
    var autoRotY = 0;
    var points = [];
    var connections = [];
    var arcs = [];
    var particles = [];
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
      cx = width / 2;
      cy = height / 2;
      radius = Math.min(width, height) * 0.38;
    }

    function generatePoints() {
      points = [];
      var n = 120;
      var goldenAngle = Math.PI * (3 - Math.sqrt(5));
      for (var i = 0; i < n; i++) {
        var y = 1 - (i / (n - 1)) * 2;
        var r = Math.sqrt(1 - y * y);
        var theta = goldenAngle * i;
        points.push({
          x: Math.cos(theta) * r,
          y: y,
          z: Math.sin(theta) * r,
          size: 1 + Math.random() * 1.5,
        });
      }
    }

    function generateConnections() {
      connections = [];
      var threshold = 0.55;
      for (var i = 0; i < points.length; i++) {
        for (var j = i + 1; j < points.length; j++) {
          var dx = points[i].x - points[j].x;
          var dy = points[i].y - points[j].y;
          var dz = points[i].z - points[j].z;
          var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < threshold) {
            connections.push({ a: i, b: j, dist: dist });
          }
        }
      }
    }

    function generateArcs() {
      arcs = [];
      var pairs = [
        [0.3, 0.5, -0.1, 0.7, -0.5, -0.4, 0.6],
        [-0.7, 0.2, 0.5, 0.2, 0.8, -0.3, 0.4],
        [0.5, -0.6, 0.3, -0.3, 0.1, 0.8, 0.5],
      ];
      for (var i = 0; i < pairs.length; i++) {
        var p = pairs[i];
        arcs.push({
          startLat: p[0],
          startLng: p[1],
          endLat: p[2],
          endLng: p[3],
          midX: p[4],
          midY: p[5],
          progress: Math.random(),
          speed: 0.002 + Math.random() * 0.003,
          alpha: p[6],
        });
      }
    }

    function generateParticles() {
      particles = [];
      for (var i = 0; i < 40; i++) {
        particles.push({
          angle: Math.random() * Math.PI * 2,
          speed: 0.0003 + Math.random() * 0.001,
          dist: radius * (1.15 + Math.random() * 0.6),
          size: 0.5 + Math.random() * 1.5,
          alpha: 0.15 + Math.random() * 0.35,
          yOffset: (Math.random() - 0.5) * radius * 1.2,
        });
      }
    }

    function project(x, y, z) {
      var cosY = Math.cos(autoRotY);
      var sinY = Math.sin(autoRotY);
      var cosX = Math.cos(rotX);
      var sinX = Math.sin(rotX);

      var x1 = x * cosY - z * sinY;
      var z1 = x * sinY + z * cosY;
      var y1 = y * cosX - z1 * sinX;
      var z2 = y * sinX + z1 * cosX;

      return {
        x: cx + x1 * radius,
        y: cy + y1 * radius,
        z: z2,
        scale: (z2 + 1.5) / 2.5,
      };
    }

    function getAccentColor() {
      var el = document.documentElement;
      var style = getComputedStyle(el);
      var accent = style.getPropertyValue("--color-accent").trim();
      if (!accent) return { r: 59, g: 130, b: 246 };
      var parts = accent.split(",").map(function (s) {
        return parseInt(s.trim(), 10);
      });
      return { r: parts[0] || 59, g: parts[1] || 130, b: parts[2] || 246 };
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      var accent = getAccentColor();
      var ar = accent.r;
      var ag = accent.g;
      var ab = accent.b;

      autoRotY += 0.002;

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(" + ar + "," + ag + "," + ab + ",0.06)";
      ctx.lineWidth = 1;
      ctx.stroke();

      var rings = [0.25, 0.5, 0.75, 1.0];
      for (var ri = 0; ri < rings.length; ri++) {
        var ringR = radius * rings[ri];
        ctx.beginPath();
        ctx.ellipse(
          cx,
          cy,
          ringR,
          ringR * Math.abs(Math.cos(rotX)),
          0,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle =
          "rgba(" + ar + "," + ag + "," + ab + "," + 0.04 * rings[ri] + ")";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      var projected = [];
      for (var i = 0; i < points.length; i++) {
        projected.push(project(points[i].x, points[i].y, points[i].z));
      }

      for (var ci = 0; ci < connections.length; ci++) {
        var c = connections[ci];
        var pa = projected[c.a];
        var pb = projected[c.b];
        if (pa.z < -0.2 && pb.z < -0.2) continue;
        var alpha = Math.min(pa.scale, pb.scale) * 0.18 * (1 - c.dist / 0.55);
        if (alpha < 0.01) continue;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.strokeStyle = "rgba(" + ar + "," + ag + "," + ab + "," + alpha + ")";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      for (var pi = 0; pi < projected.length; pi++) {
        var p = projected[pi];
        if (p.z < -0.15) continue;
        var a = p.scale * 0.7;
        var s = points[pi].size * p.scale;
        ctx.beginPath();
        ctx.arc(p.x, p.y, s, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + ar + "," + ag + "," + ab + "," + a + ")";
        ctx.fill();
      }

      for (var ai = 0; ai < arcs.length; ai++) {
        var arc = arcs[ai];
        arc.progress += arc.speed;
        if (arc.progress > 1) arc.progress = 0;

        var t = arc.progress;
        var startP = project(arc.startLat, arc.startLng * 0.5, arc.endLat);
        var endP = project(arc.endLat, arc.endLng * 0.5, arc.startLat);
        if (startP.z < -0.3 && endP.z < -0.3) continue;

        var midXp = cx + arc.midX * radius * 0.6;
        var midYp = cy + arc.midY * radius * 0.6;

        var curX =
          (1 - t) * (1 - t) * startP.x + 2 * (1 - t) * t * midXp + t * t * endP.x;
        var curY =
          (1 - t) * (1 - t) * startP.y + 2 * (1 - t) * t * midYp + t * t * endP.y;

        ctx.beginPath();
        ctx.arc(curX, curY, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + ar + "," + ag + "," + ab + "," + arc.alpha + ")";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(curX, curY, 6, 0, Math.PI * 2);
        ctx.fillStyle =
          "rgba(" + ar + "," + ag + "," + ab + "," + arc.alpha * 0.15 + ")";
        ctx.fill();
      }

      for (var fi = 0; fi < particles.length; fi++) {
        var part = particles[fi];
        part.angle += part.speed;
        var px = cx + Math.cos(part.angle) * part.dist;
        var py = cy + part.yOffset + Math.sin(part.angle * 0.7) * 8;
        ctx.beginPath();
        ctx.arc(px, py, part.size, 0, Math.PI * 2);
        ctx.fillStyle =
          "rgba(" + ar + "," + ag + "," + ab + "," + part.alpha + ")";
        ctx.fill();
      }

      var glowGrad = ctx.createRadialGradient(
        cx - radius * 0.3,
        cy - radius * 0.3,
        0,
        cx,
        cy,
        radius * 1.2
      );
      glowGrad.addColorStop(
        0,
        "rgba(" + ar + "," + ag + "," + ab + ",0.03)"
      );
      glowGrad.addColorStop(1, "rgba(" + ar + "," + ag + "," + ab + ",0)");
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      animId = requestAnimationFrame(draw);
    }

    resize();
    generatePoints();
    generateConnections();
    generateArcs();
    generateParticles();

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 100);
    });

    var observer = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          if (!animId) draw();
        } else {
          if (animId) {
            cancelAnimationFrame(animId);
            animId = null;
          }
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    draw();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGlobe);
  } else {
    initGlobe();
  }
  document.addEventListener("astro:after-swap", initGlobe);
})();
