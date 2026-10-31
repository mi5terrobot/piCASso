// 1. Formeln rendern (nur wenn Temml geladen wurde)
if (window.temml) {
    document.querySelectorAll(".tex").forEach(el => {
        temml.render(el.textContent, el);
    });
}

// 2. Schritt-Navigation in jeder Section (wie bisher)
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

// 3. Inhaltsverzeichnis und Schließen-Link erzeugen
const sections = document.querySelectorAll('section.beispiel');
const inhalt = document.getElementById('inhalt');
const toc = document.getElementById('toc');

sections.forEach(sec => {
  const thema = sec.querySelector('.thema');
  const titelHtml = thema ? thema.innerHTML : sec.id;

  // Eintrag im Inhaltsverzeichnis (<br> wird zu Leerzeichen)
  toc.insertAdjacentHTML('beforeend',
    `<li><a href="#${sec.id}">${titelHtml.replace(/<br\s*\/?>/gi, ' ')}</a></li>`);

  // Titel in <span> packen, damit Flexbox ihn als Ganzes behandelt,
  // und rechts einen echten Link zum Inhaltsverzeichnis setzen
  if (thema) {
    thema.innerHTML =
      `<span>${titelHtml}</span><a href="#" class="schliessen" aria-label="Zum Inhaltsverzeichnis">✕</a>`;
  }
});

// 4. Ansicht je nach Hash umschalten
function zeigeAnsicht() {
  const id = decodeURIComponent(location.hash.slice(1));
  const ziel = id ? document.getElementById(id) : null;
  const istSection = !!ziel && ziel.matches('section.beispiel');

  inhalt.hidden = istSection;
  sections.forEach(sec => { sec.hidden = sec !== ziel; });
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', zeigeAnsicht);
zeigeAnsicht();