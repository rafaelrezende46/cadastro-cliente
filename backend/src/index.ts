import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.SERVER_PORT;

import app from './app';
import { prisma } from './infra/prisma';

app.listen(PORT, () => {
  console.log('Express server listening on port ' + PORT); // eslint-disable-line
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
