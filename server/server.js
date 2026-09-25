import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import connectDB from './config/db.js';
import { initSocket } from './socket.js';
import { swaggerSpec } from './config/swagger.js';
import authRoutes from './routes/authRoutes.js';
import urlRoutes from './routes/urlRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

import { redirectUrl } from './controllers/urlController.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO Real-Time Engine
initSocket(server);

// Security Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // Allows flexible dev loading
  })
);

const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

// Body Parser Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'LinkForge API',
    timestamp: new Date().toISOString(),
  });
});

// Swagger / OpenAPI UI Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount Core API Routes
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

// API v1 Versioned Aliases (Phase 9 Preparation)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/urls', urlRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/ai', aiRoutes);

// Short Code Redirection Endpoint (Must be placed after API routes)
app.get('/:shortCode', redirectUrl);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`LinkForge Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`Swagger Documentation available at http://localhost:${PORT}/api-docs`);
});
