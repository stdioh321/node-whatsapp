const {
  Client,
  LocalAuth,
  WAState
} = require('whatsapp-web.js');
const qrTerminal = require('qrcode-terminal');

class WhatsAppSingleton {
  static instance;

  static getInstance() {
    if (!WhatsAppSingleton.instance) {
      WhatsAppSingleton.instance = new WhatsAppSingleton();
    }
    return WhatsAppSingleton.instance;
  }

  constructor() {
    if (!WhatsAppSingleton.instance) {
      this.whatsClient = this.getDefaultClient();

      this.whatsClient.on('qr', (qr) => {
        console.log('QR RECEIVED');
        const qrImage = qrTerminal.generate(qr, {
          small: true
        });
        console.log(qrImage);
      });

      this.whatsClient.on('ready', () => {
        console.log('Whatsapp Client is ready!');
      });

      WhatsAppSingleton.instance = this;
    }

    return WhatsAppSingleton.instance;
  }

  getDefaultClient() {
    return new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        executablePath: '/usr/bin/google-chrome-stable',
        headless: true,
        args: ['--no-sandbox']
      }
    });
  }

  initialize() {
    this.whatsClient.initialize();
  }
}

module.exports = WhatsAppSingleton;
