import https from 'https';

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const html = await fetchUrl('https://akakikality.raey.work/');
  const scripts = [...html.matchAll(/src="(\/_next\/static\/[^"]+)"/g)].map(m => m[1]);

  console.log(`Checking ${scripts.length} scripts in HTML...`);
  for (const s of scripts) {
    const code = await fetchUrl(`https://akakikality.raey.work${s}`);
    const matchesAk = code.includes('akdb.raey.work');
    const matchesDb = code.includes('//db.raey.work');
    if (matchesAk || matchesDb) {
      console.log(`${s}: akdb=${matchesAk}, db=${matchesDb}`);
    }
  }
}

main().catch(console.error);
