const express = require('express');
const { server: serverConfig } = require('./config/appConfig');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler');
const searchRoutes = require('./routes/searchRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
const cluster = require('cluster');
const os = require('os');

const numCPUs =  os.cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  const app = express();

  app.use(bodyParser.json());
  app.use(logger);
  app.use(cors()); // Use cors middleware

  app.use('/',errorHandler, searchRoutes);

  // app.use(errorHandler);

  app.listen(serverConfig.port, () => {
    console.log(`Worker ${process.pid} started, server running on http://localhost:${serverConfig.port}`);
  });
}
