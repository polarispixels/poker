// Style switch for the sampler. Sets data-style on <html> and remembers the choice
// in localStorage when the browser allows it. Without JavaScript the page stays in the blend.
(function () {
  var KEY = 'poker-style';
  var root = document.documentElement;

  function apply(style) {
    root.setAttribute('data-style', style);
    var buttons = document.querySelectorAll('[data-set-style]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', String(buttons[i].getAttribute('data-set-style') === style));
    }
  }

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* storage blocked: use the default */ }
  if (saved === 'academia' || saved === 'deco' || saved === 'blend') root.setAttribute('data-style', saved);

  document.addEventListener('DOMContentLoaded', function () {
    apply(root.getAttribute('data-style'));
    document.addEventListener('click', function (event) {
      var button = event.target.closest('[data-set-style]');
      if (!button) return;
      var style = button.getAttribute('data-set-style');
      apply(style);
      try { localStorage.setItem(KEY, style); } catch (e) { /* storage blocked: choice lasts this visit */ }
    });
  });
})();
