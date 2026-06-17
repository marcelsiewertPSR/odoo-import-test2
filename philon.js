/* PHILON Portal — ROI calculator (vanilla, German locale).
   Activates only on the Entscheidungshilfen page (#roi present). */
(function () {
  var roi = document.getElementById('roi');
  if (!roi) return;

  var methods = [
    { key: 'manual',  label: 'Manuell',    tp: 250,  labour: 1,    machine: 0   },
    { key: 'machine', label: 'Maschinell', tp: 900,  labour: 1,    machine: 180 },
    { key: 'robot',   label: 'Robotik',    tp: 1400, labour: 0.12, machine: 320 },
  ];
  var fmt = function (n) { return n.toLocaleString('de-DE', { maximumFractionDigits: 0 }); };

  var inAfter = document.getElementById('roi-area');
  var inWage  = document.getElementById('roi-wage');
  var inDays  = document.getElementById('roi-days');
  var outArea = document.getElementById('roi-area-val');
  var outWage = document.getElementById('roi-wage-val');
  var outDays = document.getElementById('roi-days-val');
  var tbody   = document.getElementById('roi-rows');
  var savEl   = document.getElementById('roi-savings');

  var resultRows = [
    { l: 'Monatliche Kosten', k: 'monthly' },
    { l: 'Jährliche Kosten', k: 'yearly' },
    { l: 'Gesamtkosten auf 5 Jahre', k: 'fiveYear' },
    { l: 'Kosten / Monat pro m²', k: 'perM2', dec: true },
  ];

  function recalc() {
    var area = +inAfter.value, wage = +inWage.value, days = +inDays.value;
    outArea.textContent = fmt(area) + ' m²';
    outWage.textContent = fmt(wage) + ' €/h';
    outDays.textContent = fmt(days) + ' Tage';

    var rows = methods.map(function (m) {
      var hoursPerDay = area / m.tp;
      var monthly = hoursPerDay * wage * m.labour * (days / 12) + m.machine;
      return { key: m.key, monthly: monthly, yearly: monthly * 12, fiveYear: monthly * 60, perM2: monthly / area };
    });

    tbody.innerHTML = resultRows.map(function (rr) {
      var cells = rows.map(function (r) {
        var val = rr.dec ? r[rr.k].toFixed(2) : fmt(r[rr.k]);
        return '<td class="' + (r.key === 'robot' ? 'robot' : '') + '">' + val + ' €</td>';
      }).join('');
      return '<tr><td>' + rr.l + '</td>' + cells + '</tr>';
    }).join('');

    var savings = Math.max(0, Math.round((1 - rows[2].fiveYear / rows[0].fiveYear) * 100));
    savEl.textContent = savings + ' %';
  }

  [inAfter, inWage, inDays].forEach(function (el) { el.addEventListener('input', recalc); });
  recalc();
})();

/* Blog category filter (vanilla) — activates on the blog index page. */
(function () {
  var filters = document.querySelectorAll('.blog-filter');
  if (!filters.length) return;
  var items = document.querySelectorAll('.blog-item');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var cat = btn.getAttribute('data-cat');
      items.forEach(function (it) {
        it.style.display = (cat === 'all' || it.getAttribute('data-cat') === cat) ? '' : 'none';
      });
    });
  });
})();
