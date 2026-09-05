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
  const code = await fetchUrl('https://akakikality.raey.work/_next/static/chunks/5524-90051e4cf5e72adc.js');
  const index = code.indexOf('akdb.raey.work');
  console.log('Snippet around akdb:', code.substring(Math.max(0, index - 100), Math.min(code.length, index + 200)));
}

main().catch(console.error);
