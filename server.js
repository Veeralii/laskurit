const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const COUNTER_FILE = path.join(__dirname, 'kavijat.txt');
const ETUSIVU_FILE = path.join(__dirname, 'etusivu.html');

let count = 0;

// Lue nykyinen lukema käynnistyksessä
try {
  const data = fs.readFileSync(COUNTER_FILE, 'utf8');
  count = parseInt(data) || 0;
} catch {
  count = 0;
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    //Lisätään laskuriin käynti (lisätään sinne kavijat.txt käynnit)
    count++;
    fs.writeFileSync(COUNTER_FILE, count.toString());

    //Lukee ja lähettää etusivu.html
    fs.readFile(ETUSIVU_FILE, 'utf8', (err, html) => {
      if (err) {
        res.writeHead(500);
        res.end('Etusivun lataus epäonnistui');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    });
    return;
  }


  if (req.method === 'GET' && req.url === '/kayntilaskuri') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head><title>Kävijälaskuri</title></head>
      <body>
        <nav>
          <a href="/">Etusivu</a>
        </nav>
        <h1>Käyntejä yhteensä kävijälaskurissa: ${count}</h1>
      </body>
      </html>
    `);
    return;
  }

  res.writeHead(404);
  res.end('Sivua ei löydy');
});

server.listen(PORT, () => {
  console.log(`Palvelin käynnissä osoitteessa http://localhost:${PORT}`);
});
