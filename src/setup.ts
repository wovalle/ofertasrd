import * as ngrok from 'ngrok';
import axios from 'axios';

// Setup telegram hook and open ngrok
async function init() {
  const url = await ngrok.connect(5000);
  console.log('Tunnel Url: ', url);

  const hookUrl =
    'https://api.telegram.org/bot453862718:AAEiWUyYJ0apaWddEzzV781qTcUxT2g9ZKg/setWebhook';

  await axios.post(hookUrl, {
    url: `${url}/ofertasrd-ca055/us-central1/routes-onTelegramMessage`,
    max_connections: 5,
  });

  console.log('ready');
}

init().catch(err => `Error on setup: ${err.message}`);
