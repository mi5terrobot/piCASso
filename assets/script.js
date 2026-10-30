document.querySelectorAll(".tex").forEach(function (el) {
    temml.render(el.textContent, el);
});

document.querySelectorAll('.beispiel').forEach(beispiel => {
  const schritte = beispiel.querySelectorAll('.schritte > .schritt');
  const nav = beispiel.querySelector('.navigation');
  if (!nav) return;

  nav.innerHTML = `
    <button type="button" class="zurueck">‹ Zurück</button>
    <span class="punkte"></span>
    <button type="button" class="weiter">Weiter ›</button>`;

  const zurueck = nav.querySelector('.zurueck');
  const weiter = nav.querySelector('.weiter');
  const punkte = nav.querySelector('.punkte');
  let aktuell = 0;

  schritte.forEach((_, i) => {
    const punkt = document.createElement('button');
    punkt.type = 'button';
    punkt.className = 'punkt';
    punkt.setAttribute('aria-label', `Schritt ${i + 1}`);
    punkt.addEventListener('click', () => zeige(i));
    punkte.append(punkt);
  });

  function zeige(i) {
    aktuell = i;
    schritte.forEach((s, j) => { s.hidden = j !== i; });
    punkte.querySelectorAll('.punkt').forEach((p, j) => {
      p.classList.toggle('aktiv', j === i);
      p.toggleAttribute('aria-current', j === i);
    });
    zurueck.disabled = i === 0;
    weiter.disabled = i === schritte.length - 1;
  }

  zurueck.addEventListener('click', () => zeige(aktuell - 1));
  weiter.addEventListener('click', () => zeige(aktuell + 1));
  zeige(0);
});