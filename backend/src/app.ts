import  express from 'express';
import * as dotenv from 'dotenv';
import competitionRoutes from './routes/competitions';
import authRoutes from './routes/auth';
import teamRoutes from './routes/teams'; // ✅
import registrationRoutes from './routes/registrations';
import matchRoutes from './routes/matches';
import standingsRoutes from './routes/standings';
import cors from "cors"

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:3000", // или ["http://localhost:3000"] если нужно массив
  credentials: true
}))


app.use(express.json());
app.use('/auth', authRoutes);
app.use('/registrations', registrationRoutes);
app.use('/teams', teamRoutes); // ✅
app.use('/competitions', competitionRoutes);
app.use('/matches', matchRoutes);
app.use('/matches', standingsRoutes);


app.get('/', (req, res) => {
  res.send('API is running 🚀');
});


export default app;
