import restify from "restify";

export const server = restify.createServer();
const { SERVER_PORT } = process.env;

server.use(
  restify.plugins.queryParser({
    mapParams: false,
    allowDots: true,
  })
);

server.use(
  restify.plugins.bodyParser({
    mapParams: false,
  })
);

server.start = (onStart) => {
  server.listen(`${SERVER_PORT}`, "localhost", onStart);
  return server;
};
