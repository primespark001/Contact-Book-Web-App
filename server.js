import express from 'express';
//import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routers.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('views'));
app.use('/', router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));