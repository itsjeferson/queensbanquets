import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { checkDatabaseConnection, closePool, getEnvironment } from '@queens-banquet/backend';
import adminRoutes from './routes/admin.routes.js';
import contentRoutes from './routes/content.routes.js';
import inquiryRoutes from './routes/inquiries.routes.js';

const app = express();
const { corsOrigin } = getEnvironment();
const port = process.env.PORT ?? 4000;
const allowedOrigins = corsOrigin.split(',').map((origin) => origin.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
  }),
);
app.use(express.json({ limit: '6mb' }));

app.get('/health', async (_request, response) => {
  try {
    const databaseConnected = await checkDatabaseConnection();

    return response.json({
      status: 'ok',
      service: 'queens-banquet-api',
      databaseConnected,
    });
  } catch {
    return response.status(503).json({
      status: 'degraded',
      service: 'queens-banquet-api',
      databaseConnected: false,
    });
  }
});

app.use('/content', contentRoutes);
app.use('/admin', adminRoutes);
app.use('/inquiries', inquiryRoutes);

app.use((error, _request, response, _next) => {
  if (error.message === 'Not allowed by CORS') {
    return response.status(403).json({ message: 'Origin not allowed.' });
  }

  console.error('Unhandled API error:', error);
  return response.status(500).json({ message: 'Unexpected server error.' });
});

const server = app.listen(port, () => {
  console.log(`Queen's Banquet Events API listening on port ${port}`);
});

async function shutdown() {
  server.close(async () => {
    await closePool();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
