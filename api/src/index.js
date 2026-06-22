import express from 'express';
import inquiryRoutes from './routes/inquiries.routes.js';

const app = express();
const port = process.env.PORT ?? 4000;

app.use(express.json());
app.get('/health', (_request, response) => {
  response.json({ status: 'ok', service: 'queens-banquet-api' });
});
app.use('/inquiries', inquiryRoutes);

app.listen(port, () => {
  console.log(`Queens Banquet API listening on port ${port}`);
});
