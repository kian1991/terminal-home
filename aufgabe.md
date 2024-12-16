---
title: Terminal Home
---

# Aufgabe: Terminal Home

## Beschreibung

Als IT-Nerds wollen wir unser Terminal nicht nur nutzen um Dateien zu kopieren oder zu verschieben,  
sondern auch um uns zu unterhalten. Wir wollen ein Terminal Home, das uns beim Arbeiten unterhält.

Wir bauen uns ein Programm welches uns die neusten News anhand von RSS-Feeds anzeigt und unsere Lieblings Radio-Station abspielt.

## Projekt Setup

1. Erstelle ein neues Verzeichnis für das Projekt zB. `terminal-home`
2. Initialisiere ein neues Node.js Projekt mit `npm init -y`
3. Installiere TypeScript mit `npm install typescript --save-dev`
4. Initialisiere TypeScript mit `npx tsc --init` und passe die `tsconfig.json` an (zB. `outDir` auf `./dist` und `rootDir` auf `./src`)


## Anforderungen
### Aufgabe 1: Willkommen
1. Das Program kann mit `npm run start` gestartet werden.
2. Das Programm gibt dann eine Willkommennachricht aus. Z.B.:  
```  
Guten Tag Fabian!

Heute ist ein toller Tag um jede Menge Code zu schreiben.
 
Hier ist dein Terminal Home
---------------
```
Erstelle dazu die Klasse Terminal mit den Methoden **print(content)** und **printLine()**.  
1. **printContent(content)** kann als Parameter entweder einen String oder ein Array von Strings annehmen.
  Alle Strings werden einzeln mit console.log ausgegeben.
2. **printLine()** gibt mit console.log eine horizontale Trennline aus: "----------"

Erstelle dann die Klasse TerminalHome, die von Temrinal erbt. Die Klasse bekommt vorerst nur die Methode **printWelcome()**.  
Diese Soll die Willkommensmeldung ausgeben.  

::: info
Unter Mac und Linux ist der Benutzername im System in der Umgebungsvariable $USER abgelegt.  
Mit node können wir diese Variablen auch auslesen:
```javascript
const username = console.log(process.env.USER) || 'Nobody';
console.log(username);
```
:::

### Aufgabe 2: Top News
Im Terminal Home sollen nun News Schlagzeilen angezeigt werden.

Um Rss Feeds zu parsen benötigen wir dieses Package:  
[rss-parser - npm](https://www.npmjs.com/package/rss-parser)

Ein passenden RSS-Feed findet Ihr hier: [https://www.rss-verzeichnis.de/top.php]
1. Erstelle eine Klasse NewsFeed mit den Methoden **initialize und getTopTitles**
2. Der Constructor soll einen Namen und eine RSS URL als Parameter annehmen. 
3. Die Methode **initialize** soll den RSS Feed parsen und die daten zwischen speichern.
4. Die Methode **getTopTitles(n)** soll eine liste mit den n (default 5) neusten Titeln zurückgeben:
5. In der Klasse **HomeTerminal** solltest du eine Methode **printList** hinzufügen.
5. in der index.ts: benutze die neue Klasse um die Top Schlagzeilen zu laden und dann mit *printList* unter der Willkommensnachricht anzuzeigen.
Ausgabe z.B.:
```
# Heise RSS Feed

1. Top 10: Die besten GPS-Tracker für Fahrrad, Auto und Co. – mit & ohne Abo
2. Zuckerbremse gelöst: Süße Tomaten dank Gentechnik ganz groß
3. Skype-Änderung: Telefonanrufe nur noch mit Abo möglich
4. ...
----------
```

### Aufgabe 3: Mehr News
Frage nun den Benutzer ob er mehr New lesen möchte.  
  
Um Interaktiviät in der Konsole zu haben, können wir das Package `inquirer` verwenden:
- [SBoudrias/Inquirer.js: A collection of common interactive command line user interfaces.](https://github.com/SBoudrias/Inquirer.js?tab=readme-ov-file)

1. In TerminalHome soll eine Methode **askForAction** implementiert werden. Zeige mit inquirer eine Liste an, mit den Werten **News Anzeigen** und **Beenden**.
2. *Beenden* soll das Programm einfach beenden ;)
3. *News Anzeigen* soll ein neues Prompt anzeigen mit der Frage "Welche News (1...5)?" und als Wert eine Zahl annehmen.
4. Rufe die Funktion **getNews(n)** vom NewsFeed auf (diese Funktion musst du noch implementieren)
5. Das Ergebnis von *getNews* soll mit dem TerminalHome ausgegeben werden. Lege dafür eine Methode **printNewsArticle(item)** an, die das Formatieren und "printen" übernimmt.
6. Wenn der Benutzer eine ungültige Zahl angibt soll ein Fehler erscheinen, ansonsten Zeige die Komplette News.  
**Tip: Die Schritte können entweder ganz in der TerminalHome implementiert werden oder teilweise in der index.ts**

Z.B:
```
? Was willst du nun tun?
> News Anzeigen
  Beenden

----------------
## Skype-Änderung: Telefonanrufe nur noch mit Abo möglich
(Published: Sun, 15 Dec 2024 17:57:00 +0100)

Wer künftig reine Telefongeräte mit Skype anrufen möchte, muss ein Abo abschließen. Ein Guthabenmodell gibt es nicht mehr.

[https://www.heise.de/news/Microsoft-stellt-Skype-Anrufe-bei-Telefonnummern-auf-Abomodell-um-10200197.html?wt_mc=rss.red.ho.ho.rdf.beitrag.beitrag]
-----------------
```

::: info
Die Struktur der Feed-Daten erfährst du, wenn du nach dem laden einmal ein item mit console.log aus gibst.
:::

### Aufgabe 4: Musik
Wir können im Terminal Home das Radio starten.

Zum abspielen von Musik brauchen wir noch einen Player.  
Wir benutzen den [MPV Player](https://mpv.io/).  
installiere ihn mit `brew install mpv`

Mit diesem Code kannst du den Player aus Node heraus starten und kontrollieren:  
```
const { spawn } = require('child_process');

const player = spawn('mpv', ['https://lyd.nrk.no/nrk_radio_jazz_mp3_h']);

player.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

player.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

// Handle cleanup
process.on('SIGINT', () => {
    player.kill();
    process.exit(0);
});
```

1. Baue deine eigene **RadioPlayer** Klasse.
2. Eine Methode **play** soll den player starten
3. In der Abfrage von Aufgabe 3 "Was willst du tun?" soll auch der Eintrag "Radio hören" auftauchen.
3. Starte dann den Radio-Stream

::: info
Hier kann man gut nach Radio-Urls suchen: [Radio stream URL search engine](https://streamurl.link/)
und: [Radio stream URL search engine 2](https://www.radio-browser.info/)
:::
