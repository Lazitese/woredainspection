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

async function check() {
  const pages = ['/', '/about', '/statistics', '/files', '/api/woredas', '/api/analytics'];
  for (const page of pages) {
    try {
      const html = await fetchUrl(`https://akakikality.raey.work${page}`);
      console.log(`Page: ${page}, length: ${html.length}`);
      if (html.includes('የሀምሌ ወር') || html.includes('8441da44')) {
        console.log(`-> Page ${page} CONTAINS FEDERAL NEWS!`);
      }
      if (html.includes('የፓርቲዉን ስራ ይበልጥ ተጠናክሮ እንዲቀጥል')) {
        console.log(`-> Page ${page} CONTAINS AKAKI NEWS!`);
      }
    } catch (e) {
      console.log(`Page: ${page} error:`, e.message);
    }
  }
}

check().catch(console.error);
