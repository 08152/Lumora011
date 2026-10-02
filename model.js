// model.js

let knowledgeBase = [];

// Liest automatisch alle JSON-Dateien aus dem Ordner DATEN
async function loadAllJson() {
  try {
    // GitHub Pages liefert ein HTML-Verzeichnislisting
    const res = await fetch("DATEN/");
    const html = await res.text();

    // Alle Dateinamen extrahieren
    const jsonFiles = [...html.matchAll(/href="([^"]+\.json)"/g)]
      .map(m => "DATEN/" + m[1]);

    console.log("Gefundene JSON-Dateien:", jsonFiles);

    const allData = [];

    for (const file of jsonFiles) {
      try {
        const fileRes = await fetch(file);
        const data = await fileRes.json();

        if (Array.isArray(data)) {
          allData.push(...data);
        } else {
          allData.push(data);
        }
      } catch (err) {
        console.error("Fehler beim Laden:", file, err);
      }
    }

    knowledgeBase = allData;
    console.log("Geladene Einträge:", knowledgeBase.length);

  } catch (err) {
    console.error("Ordner DATEN konnte nicht gelesen werden:", err);
  }
}

// Mini-Suchmodell
function generateReply(userText) {
  const tokens = userText.toLowerCase().split(/\s+/);

  let bestMatch = null;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    const frage = (entry.frage || "").toLowerCase();
    let score = 0;

    for (const t of tokens) {
      if (frage.includes(t)) score++;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch) {
    return bestMatch.antwort || "Ich habe etwas gefunden, aber keine Antwort.";
  }

  return "Ich habe nichts Passendes in meinen JSON-Daten gefunden.";
}

// Start
loadAllJson();
