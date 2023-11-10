const {
  sanitizeNumber,
  addSuffixToNumber
} = require("./utils");
const {
  MessageMedia,
} = require('whatsapp-web.js');

class WhatsService {
  constructor(whatsClient) {
    this.whatsClient = whatsClient
  }

  async sendMessages(numbers = [], messages = []) {
    numbers = this.formatNumbers(numbers)
    const result = await Promise.all(numbers.map(async (number) => {
      return await Promise.all(messages.map(message => {
        return this.whatsClient.sendMessage(number, message)
      }))
    }))
    return result
  }
  async sendFiles(numbers = [], files = [], caption = "", viewOnce = false) {
    numbers = this.formatNumbers(numbers)
    const result = await Promise.all(numbers.map(async (number) => {
      return await Promise.all(files.map(file => {
        const messageMedia = new MessageMedia(file.mimetype, file.data.toString('base64'), file.name)
        return this.whatsClient.sendMessage(number, messageMedia, {
          ...(caption && {
            caption: caption
          }),
          ...(viewOnce && {
            isViewOnce: viewOnce
          })
        })
        return 'ok'
      }))
    }))
    return result
  }

  formatNumbers(numbers = []) {
    return numbers.map(number => addSuffixToNumber(sanitizeNumber(number)))
  }

}


module.exports.WhatsService = WhatsService
