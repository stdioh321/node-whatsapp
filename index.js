const { fastify } = require("./routes");

const PORT = parseInt(process.env.PORT || 3000)
const HOST = '0.0.0.0'

const startFastify = async () => {
  try {
    await fastify.listen({
      port: PORT,
      host: HOST
    });
    console.log(`Server is listening on http://${HOST}:${PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
startFastify();
