import { app } from './app';
import { env } from './config/env';
import { initDb } from './config/initDb';

const startServer = async (): Promise<void> => {
  try {
    await initDb();
    app.listen(env.port, () => {
      console.log(`DevPulse API is running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

void startServer();

export default app;
