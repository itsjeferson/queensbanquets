export function getEnvironment() {
  return {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    databaseUrl: process.env.DATABASE_URL ?? '',
    notificationsEnabled: process.env.NOTIFICATIONS_ENABLED === 'true',
  };
}
