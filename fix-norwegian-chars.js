#!/usr/bin/env node
/**
 * Fix Norwegian Characters Script
 * Corrects missing æ, ø, å characters in HTML files
 *
 * Usage: node fix-norwegian-chars.js
 */

const fs = require('fs');
const path = require('path');

// Directory containing HTML files
const htmlDir = __dirname;

// Common Norwegian word replacements (incorrect → correct)
// These are words commonly used in Norwegian business/electrical websites
const replacements = [
  // Å replacements
  ['\\bvare\\b', 'våre'],
  ['\\bVar\\b', 'Vår'],
  ['\\bvar\\b', 'vår'],
  ['\\bar\\b', 'år'],
  ['\\bAr\\b', 'År'],
  ['\\bnar\\b', 'når'],
  ['\\bNar\\b', 'Når'],
  ['\\bga\\b', 'gå'],
  ['\\bGa\\b', 'Gå'],
  ['\\bsta\\b', 'stå'],
  ['\\bSta\\b', 'Stå'],
  ['\\bfa\\b', 'få'],
  ['\\bFa\\b', 'Få'],
  ['\\bpalitelig', 'pålitelig'],
  ['\\bPalitelig', 'Pålitelig'],
  ['\\btilgang\\b', 'tilgång'],
  ['\\bbade\\b', 'både'],
  ['\\bBade\\b', 'Både'],
  ['\\bmatte\\b', 'måtte'],
  ['\\bMatte\\b', 'Måtte'],
  ['\\bmal\\b', 'mål'],
  ['\\bMal\\b', 'Mål'],
  ['\\bmate\\b', 'måte'],
  ['\\bMate\\b', 'Måte'],
  ['\\bkvalitetsmal', 'kvalitetsmål'],

  // Ø replacements
  ['\\bstorre\\b', 'større'],
  ['\\bStorre\\b', 'Større'],
  ['\\bsosterselskaper', 'søsterselskaper'],
  ['\\bSosterselskaper', 'Søsterselskaper'],
  ['\\bhoye\\b', 'høye'],
  ['\\bHoye\\b', 'Høye'],
  ['\\bhoy\\b', 'høy'],
  ['\\bHoy\\b', 'Høy'],
  ['\\bnodvendig', 'nødvendig'],
  ['\\bNodvendig', 'Nødvendig'],
  ['\\bfore\\b', 'føre'],
  ['\\bFore\\b', 'Føre'],
  ['\\bforst\\b', 'først'],
  ['\\bForst\\b', 'Først'],
  ['\\bstorst', 'størst'],
  ['\\bStorst', 'Størst'],
  ['\\bproblemlosning', 'problemløsning'],
  ['\\blosning', 'løsning'],
  ['\\bLosning', 'Løsning'],
  ['\\blosninger', 'løsninger'],
  ['\\bLosninger', 'Løsninger'],
  ['\\bfolg', 'følg'],
  ['\\bFolg', 'Følg'],
  ['\\bnokkelen', 'nøkkelen'],
  ['\\bNokkelen', 'Nøkkelen'],
  ['\\bnokkel', 'nøkkel'],
  ['\\bNokkel', 'Nøkkel'],
  ['\\bmiljo', 'miljø'],
  ['\\bMiljo', 'Miljø'],
  ['\\bgronne', 'grønne'],
  ['\\bGronn', 'Grønn'],
  ['\\bgronn', 'grønn'],
  ['\\bkjorer', 'kjører'],
  ['\\bKjorer', 'Kjører'],
  ['\\bkjore\\b', 'kjøre'],
  ['\\bKjore\\b', 'Kjøre'],
  ['\\btor\\b', 'tør'],
  ['\\bTor\\b', 'Tør'],
  ['\\bsor\\b', 'sør'],
  ['\\bSor\\b', 'Sør'],
  ['\\bnor\\b', 'nør'],
  ['\\bNor\\b', 'Nør'],
  ['\\bbor\\b', 'bør'],
  ['\\bBor\\b', 'Bør'],
  ['\\bgor\\b', 'gør'],
  ['\\bGor\\b', 'Gør'],
  ['\\bmoter\\b', 'møter'],
  ['\\bMoter\\b', 'Møter'],
  ['\\bmote\\b', 'møte'],
  ['\\bMote\\b', 'Møte'],
  ['\\bblomst', 'blømst'],
  ['\\bkop\\b', 'køp'],
  ['\\bodelegge', 'ødelegge'],
  ['\\bOdelegge', 'Ødelegge'],
  ['\\bokonomisk', 'økonomisk'],
  ['\\bOkonomisk', 'Økonomisk'],
  ['\\bokonomi', 'økonomi'],
  ['\\bOkonomi', 'Økonomi'],
  ['\\bokning', 'økning'],
  ['\\bOkning', 'Økning'],
  ['\\boke\\b', 'øke'],
  ['\\bOke\\b', 'Øke'],
  ['\\boker\\b', 'øker'],
  ['\\bOker\\b', 'Øker'],
  ['\\boyeblikkelig', 'øyeblikkelig'],
  ['\\bOyeblikkelig', 'Øyeblikkelig'],
  ['\\bonsker', 'ønsker'],
  ['\\bOnsker', 'Ønsker'],
  ['\\bonske\\b', 'ønske'],
  ['\\bOnske\\b', 'Ønske'],

  // Æ replacements
  ['\\bvaere\\b', 'være'],
  ['\\bVaere\\b', 'Være'],
  ['\\bnaering', 'næring'],
  ['\\bNaering', 'Næring'],
  ['\\bnaermeste', 'nærmeste'],
  ['\\bNaermeste', 'Nærmeste'],
  ['\\bnaer\\b', 'nær'],
  ['\\bNaer\\b', 'Nær'],
  ['\\blaere\\b', 'lære'],
  ['\\bLaere\\b', 'Lære'],
  ['\\blaerer', 'lærer'],
  ['\\bLaerer', 'Lærer'],
  ['\\blaerling', 'lærling'],
  ['\\bLaerling', 'Lærling'],
  ['\\baere\\b', 'ære'],
  ['\\bAere\\b', 'Ære'],
  ['\\baerlig', 'ærlig'],
  ['\\bAerlig', 'Ærlig'],

  // Common electrical/technical terms
  ['\\belektriker\\b', 'elektriker'],
  ['\\binstallasjoner\\b', 'installasjoner'],
  ['\\bstromforsyning', 'strømforsyning'],
  ['\\bStromforsyning', 'Strømforsyning'],
  ['\\bstrom\\b', 'strøm'],
  ['\\bStrom\\b', 'Strøm'],

  // Location-specific
  ['\\bomradet', 'området'],
  ['\\bOmradet', 'Området'],
  ['\\bomrade\\b', 'område'],
  ['\\bOmrade\\b', 'Område'],
  ['\\bomrader', 'områder'],
  ['\\bOmrader', 'Områder'],

  // Common business terms
  ['\\bkjope\\b', 'kjøpe'],
  ['\\bKjope\\b', 'Kjøpe'],
  ['\\bkjoper', 'kjøper'],
  ['\\bKjoper', 'Kjøper'],
  ['\\btjenster', 'tjenester'],
  ['\\bforstar', 'forstår'],
  ['\\bForstar', 'Forstår'],
  ['\\boppfolging', 'oppfølging'],
  ['\\bOppfolging', 'Oppfølging'],
  ['\\bsamarbeidet\\b', 'samarbeidet'],
  ['\\berfaring\\b', 'erfaring'],
  ['\\bsporsmal', 'spørsmål'],
  ['\\bSporsmal', 'Spørsmål'],
  ['\\bsoknad', 'søknad'],
  ['\\bSoknad', 'Søknad'],
  ['\\bsoknader', 'søknader'],
  ['\\bSoknader', 'Søknader'],
  ['\\bsok\\b', 'søk'],
  ['\\bSok\\b', 'Søk'],
  ['\\bsoker', 'søker'],
  ['\\bSoker', 'Søker'],

  // Common phrases in service industry
  ['\\bkontakt oss\\b', 'kontakt oss'],
  ['\\bom oss\\b', 'om oss'],
  ['\\bOm oss\\b', 'Om oss'],
  ['\\bOm Oss\\b', 'Om Oss'],

  // Double-encoded UTF-8 patterns (Ã followed by character)
  ['Ã¦', 'æ'],
  ['Ã†', 'Æ'],
  ['Ã¸', 'ø'],
  ['Ã˜', 'Ø'],
  ['Ã¥', 'å'],
  ['Ã…', 'Å'],
  ['Ã©', 'é'],
  ['Ã¨', 'è'],
  ['Ã¼', 'ü'],
  ['Ã¶', 'ö'],
  ['Ã¤', 'ä'],

  // HTML entities (convert to actual characters for consistency)
  ['&aelig;', 'æ'],
  ['&AElig;', 'Æ'],
  ['&oslash;', 'ø'],
  ['&Oslash;', 'Ø'],
  ['&aring;', 'å'],
  ['&Aring;', 'Å'],
];

// Get all HTML files
const htmlFiles = fs.readdirSync(htmlDir)
  .filter(file => file.endsWith('.html'))
  .map(file => path.join(htmlDir, file));

console.log('🔧 Norwegian Character Fix Script');
console.log('==================================\n');
console.log(`Found ${htmlFiles.length} HTML files to process.\n`);

let totalReplacements = 0;

htmlFiles.forEach(filePath => {
  const fileName = path.basename(filePath);
  let content = fs.readFileSync(filePath, 'utf8');
  let fileReplacements = 0;
  const changes = [];

  replacements.forEach(([pattern, replacement]) => {
    const regex = new RegExp(pattern, 'g');
    const matches = content.match(regex);
    if (matches) {
      const count = matches.length;
      // Only replace if the pattern and replacement are different
      if (pattern.replace(/\\b/g, '') !== replacement) {
        content = content.replace(regex, replacement);
        fileReplacements += count;
        changes.push(`  "${pattern.replace(/\\b/g, '')}" → "${replacement}" (${count}x)`);
      }
    }
  });

  if (fileReplacements > 0) {
    // Write the corrected content back
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${fileName}: ${fileReplacements} replacements`);
    changes.forEach(change => console.log(change));
    console.log('');
    totalReplacements += fileReplacements;
  } else {
    console.log(`⏭️  ${fileName}: No changes needed`);
  }
});

console.log('\n==================================');
console.log(`✨ Done! Total replacements: ${totalReplacements}`);
console.log('\nFiles are now saved with proper UTF-8 encoding.');
console.log('Norwegian characters (æ, ø, å) should display correctly.');
