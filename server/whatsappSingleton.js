const {
  Client,
  LocalAuth,
  WAState
} = require('whatsapp-web.js');
const qrTerminal = require('qrcode-terminal');

class WhatsappSingleton {
  static instance;

  static getInstance() {
    if (!WhatsappSingleton.instance) {
      WhatsappSingleton.instance = new WhatsappSingleton();
    }
    return WhatsappSingleton.instance;
  }

  constructor() {
    if (!WhatsappSingleton.instance) {
      this.whatsClient = this.getDefaultClient();

      this.handleEvents();

      WhatsappSingleton.instance = this;
    }

    return WhatsappSingleton.instance;
  }

  handleEvents() {
    // this.whatsClient.on('qr', (qr) => {
    //   console.log('QR RECEIVED');
    //   const qrImage = qrTerminal.generate(qr, {
    //     small: true
    //   });
    //   console.log(qrImage);
    // });

    this.whatsClient.on('ready', () => {
      console.log('Whatsapp Client is ready!');
    });
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

  async reset() {
    try {
      await this.whatsClient.logout()
      await this.whatsClient.destroy()
      this.instance = null;
      await WhatsappSingleton.getInstance().initialize()
      return true
    } catch (error) {

    }
    return false
  }
  async getQrConnection(timeout = 20000) {
    await this.reset()
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(false)
      }, timeout);
      this.whatsClient.once('qr', (qr) => {
        console.log('QR RECEIVED');
        const qrImage = qrTerminal.generate(qr, {
          small: true
        });

        resolve(qr)
      });
    })

  }
  initialize() {
    this.whatsClient.initialize();
  }
}

module.exports = WhatsappSingleton;
