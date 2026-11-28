// Считает статистику сессии ядром анализатора и печатает JSON.
// Использование: node tools/analyzer_stats.cjs <папка с логами>
const fs = require("fs");
const path = require("path");

const dir = process.argv[2];
if (!dir) {
  console.error("укажи папку с логами");
  process.exit(1);
}

const html = fs.readFileSync(path.join("tools", "analyzer", "index.html"), "utf8");
const core = html.slice(html.indexOf("/*CORE-BEGIN*/"), html.indexOf("/*CORE-END*/"));
const api = new Function(core + "\nreturn { analyze };")();

const texts = fs.readdirSync(dir)
  .filter(f => f.endsWith(".txt"))
  .map(f => fs.readFileSync(path.join(dir, f), "utf8"));

const r = api.analyze(texts);
console.log(JSON.stringify({
  hands: r.hands,
  net: r.net,
  rake: r.rakeMine,
  preRake: r.preRake,
  bb100: r.bb100,
  bets: r.bets.length,
  minRaises: r.minRaises.length,
  limps: r.limps,
  allins: r.allins,
  cashouts: r.cashouts
}, null, 1));
