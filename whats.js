const {
  Client,
  LocalAuth,
  WAState
} = require('whatsapp-web.js');
const qrTerminal = require('qrcode-terminal');

const whatsClient = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    executablePath: '/usr/bin/google-chrome-stable',
    headless: true,
    args: ['--no-sandbox']
  }
});

whatsClient.on('qr', (qr) => {
  console.log('QR RECEIVED');
  const qrImage = qrTerminal.generate(qr, {
    small: true
  })
  console.log(qrImage);
});

whatsClient.on('ready', () => {
  console.log('Whatsapp Client is ready!');
});

whatsClient.initialize()

module.exports.whatsClient = whatsClient
module.exports.isConnected = async function isConnected() {

  try {
    return (await whatsClient.getState()) === WAState.CONNECTED
  } catch (error) {
    console.log({
      error
    });
  }
  return false
}
