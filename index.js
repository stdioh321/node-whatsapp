const {
  Client,
  LocalAuth,
  MessageMedia,
  WAState
} = require('whatsapp-web.js');
const fastify = require('fastify')();
const fileUpload = require('fastify-file-upload')

fastify.register(fileUpload);

const {
  whatsClient,
  isConnected
} = require('./whats');
const {
  postMessagesDto,
  postFilesDto
} = require('./dtos');
const {
  WhatsService
} = require('./whatsService');
const {
  Readable
} = require('stream');

const PORT = parseInt(process.env.PORT || 3000)

let whatsService = new WhatsService(whatsClient)

async function middlewareIsConnectedToWhatsapp(request, reply, done) {

  let result = false
  try {
    result = await isConnected()
  } catch (error) {}

  if (!result) return reply.code(401).send({
    error: 'Is no connected'
  });

  done();

}

fastify.addHook('preHandler', (request, reply, done) => {
  if (request.url.startsWith('/action')) {
    middlewareIsConnectedToWhatsapp(request, reply, done)
  } else {
    done()
  }
});


fastify.get('/health', async () => {
  return 'ok';
});

fastify.get('/state', async (request, reply) => {
  try {
    const state = await whatsClient.getState();
    return state || 'No State yet'
  } catch (error) {
    console.log({
      error
    });
  }
  return reply.code(500).send();
});

fastify.post('/action/message', async (request, reply) => {


  const data = postMessagesDto.safeParse(request.body);
  if (!data.success) return reply.code(400).send(data.error)
  return await whatsService.sendMessages(data.data.numbers, data.data.messages)
});


fastify.post('/action/files', async (request, reply) => {
  const {
    messages,
    numbers,
    files,
    viewOnce,
    caption
  } = request.body;

  const data = postFilesDto.safeParse({
    messages: JSON.parse(messages || null),
    numbers: JSON.parse(numbers || null),
    files: Array.isArray(files) ? files : [files],
    viewOnce: viewOnce === 'true',
    caption
  });

  return data.success ?
    await whatsService.sendFiles(data.data.numbers, data.data.files, data.data.caption, data.data.viewOnce) :
    reply.code(400).send(data.error);
});

fastify.get('/action/logout', async () => {
  try {
    await whatsClient.logout()
    return true
  } catch (error) {
    console.log({
      error
    });
  }
  return false
});

fastify.get('/connected', async (request, reply) => {
  try {
    return await isConnected()
  } catch (error) {
    console.log({
      error
    });
  }
  return reply.send(false)
});

const startFastify = async () => {
  try {
    await fastify.listen({
      port: PORT
    });
    console.log(`Server is listening on http://localhost:${PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
startFastify();
