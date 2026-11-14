// Fills in the landing page: live API status, the address phones should use, and the year.
(function () {
  var $ = function (id) { return document.getElementById(id); };

  $("year").textContent = String(new Date().getFullYear());

  // The address this page was opened at is the one the app needs, unless it was
  // opened on the server itself, where "localhost" means nothing to a phone.
  var host = location.hostname;
  var local = host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "[::1]";
  var port = location.port ? ":" + location.port : "";
  if (local) {
    $("address").textContent = location.protocol + "//<this-computer's-IP>" + port;
    $("address-hint").textContent =
      "You opened this page on the server itself. Phones need the server's network address " +
      "instead of localhost: run ipconfig and use its IPv4 address. Phones must be on the same network.";
  } else {
    $("address").textContent = location.origin;
  }

  function formatUptime(seconds) {
    var d = Math.floor(seconds / 86400);
    var h = Math.floor((seconds % 86400) / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    if (d > 0) return d + " d " + h + " h";
    if (h > 0) return h + " h " + m + " min";
    return m > 0 ? m + " min" : "under a minute";
  }

  function show(state, text, meta) {
    $("status").setAttribute("data-state", state);
    $("status-text").textContent = text;
    $("status-meta").textContent = meta;
  }

  fetch("/api/auth/healthcheck", { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function (body) {
      var data = (body && body.data) || {};
      var parts = [];
      if (data.version) parts.push("Version " + data.version);
      if (typeof data.uptime === "number") parts.push("up " + formatUptime(data.uptime));
      show("up", "Server running", parts.join(" · ") || "The API is answering.");
    })
    .catch(function () {
      show("down", "API not responding",
        "This page loaded, but the API did not answer. Check the service log.");
    });
})();
