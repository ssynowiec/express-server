import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';

const expressApp = express();
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 4000;
const { app, getWss } = expressWs(expressApp);

app.use(cors());

app.get('/', (_, res) => {
  res.send('Hello World!');
});

app.ws('/', (ws) => {
  ws.on('message', (msg) => {
    for (const client of getWss().clients) {
      if (client !== ws) {
        client.send(msg);
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
