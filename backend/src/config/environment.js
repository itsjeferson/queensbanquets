export function getEnvironment() {
  return {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    databaseUrl: process.env.DATABASE_URL ?? '',
    notificationsEnabled: process.env.NOTIFICATIONS_ENABLED === 'true',
    adminJwtSecret: process.env.ADMIN_JWT_SECRET ?? 'dev-admin-secret-change-me',
    adminEmail: process.env.ADMIN_EMAIL ?? 'queensbanquet07@gmail.com',
    adminPassword: process.env.ADMIN_PASSWORD ?? 'marou-admin',
    corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5174',
  };
}
