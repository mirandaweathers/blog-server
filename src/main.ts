import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { userRouter } from './routes/userRoute';
import { postRouter } from './routes/postRoute';
import { authRouter } from './middleware/authorize';
import { commentRouter } from './routes/commentRoute';

const path = require('path');

const app = express();

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, res, next) => {
    
//     console.log(`${req.method}: ${req.url}`)
//     console.log(req.body);
//     console.log(res.status.toString);
//     next();
// }); 
app.use('/', authRouter);
app.use('/Users', userRouter);
app.use('/Posts', postRouter);
app.use('/Comments', commentRouter);
app.use(express.static('public'));

app.get('/', (req, res, next) => {
    res.sendFile(path.join(process.cwd(), 'public/index.html'));
})

app.get('*',function (req, res) {
    res.redirect('/');
});

app.listen(3000);