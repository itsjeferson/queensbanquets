import { getEnvironment } from './config/environment.js';
import { logger } from './lib/logger.js';

const environment = getEnvironment();

logger.info('Queens Banquet backend initialized.', {
  environment: environment.nodeEnv,
  notificationsEnabled: environment.notificationsEnabled,
});
