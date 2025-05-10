// src/main.ts
import 'reflect-metadata'; // MUST be the first import for tsyringe
import express, { Express, Request, Response } from 'express';
import config from '@core/config';
import { connectDB } from '@core/database/mongo';
import { globalErrorHandler } from '@core/middleware/error-handler';
import { appContainer } from '@core/di/container';
import http from 'http';
import { userRoutes } from '@modules/userManagement/user.routes';
import registerServices from '@core/di/registerServices';
import { busRoutes } from '@modules/busRouteManagement/bus.routes';
import { busDriverRoutes } from '@modules/busRouteManagement/bus-driver.routes';
import { routesRoutes } from '@modules/busRouteManagement/routes.routes';
import { controlCenterRoutes } from '@modules/operationsControl/control-center.routes';
import swaggerui from 'swagger-ui-express';
import { swaggerSpec } from '@core/config/swaggerConfig';
import { passengerRoutes } from '@modules/passengerService/passenger.routes';
import { initSocketServer } from '@core/websocket/socket-server';

type HttpServer = http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>;

const initializeApp = async (): Promise<[Express, HttpServer]> => {
  await registerServices(appContainer);

  // --- Express App Setup ---
  const app: Express = express();
  const httpServer = http.createServer(app); // Create HTTP server with Express app

  // Initialize Socket.IO server
  initSocketServer(httpServer);

  // Connect to MongoDB
  await connectDB();

  registerMiddlewares(app);

  registerRoutes(app);

  // --- Global Error Handler (Must be LAST middleware) ---
  app.use(globalErrorHandler);

  return [app, httpServer];
};

const registerMiddlewares = (app: Express) => {
  app.use(express.json()); // Middleware to parse JSON bodies
  app.use(express.urlencoded({ extended: true })); // Middleware for URL-encoded bodies
    app.use('/swagger', swaggerui.serve, swaggerui.setup(swaggerSpec));
};

const registerRoutes = (app: Express) => {
  // --- Health Check Endpoint ---
  app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Bus Tracking API is running!');
  });

  // Ensure API base path has /api prefix as specified in requirements
  const apiBasePath = '/api';

  app.use(`${apiBasePath}/accounts`, userRoutes(app.router));
  app.use(`${apiBasePath}/buses`, busRoutes(app.router));
  app.use(`${apiBasePath}/driver`, busDriverRoutes(app.router));
  app.use(`${apiBasePath}/routes`, routesRoutes(app.router));
  app.use(`${apiBasePath}/control-center`, controlCenterRoutes(app.router));
  app.use(`${apiBasePath}/passenger`, passengerRoutes(app.router));
};

const startServer = () => {
  // --- Start Server ---
  console.log('Initializing application...'); // Add this line
  initializeApp()
    .then(([app, httpServer]) => {
      console.log('Application initialized successfully!'); // Add this line
      const port = config.port;
      httpServer.listen(port, () => {
        console.log(`Server running in ${config.nodeEnv} mode on port ${port}`);
        console.log(`API base path: /api`);
      });
    })
    .catch((error) => {
      console.error('Failed to initialize application:', error);
      process.exit(1);
    });
};

// --- Start the server ---
startServer();
