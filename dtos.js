const {
  z
} = require("zod");

const numbers = z.array(z.number().or(z.string())).min(1);
const messages = z.array(z.string()).min(1);

const postMessagesDto = z.object({
  numbers,
  messages
})

const postFilesDto = z.object({
  numbers,
  files: z.array(z.any()).min(1),
  caption: z.string().min(1).optional(),
  viewOnce: z.boolean().default(false).optional()
})

module.exports.numbers = numbers
module.exports.messages = messages
module.exports.postMessagesDto = postMessagesDto
module.exports.postFilesDto = postFilesDto
