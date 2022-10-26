import express from 'express';
import bodyParser from 'body-parser';
import { userRouter } from './routes/userRoute';
import { postRouter } from './routes/postRoute';
import { authRouter } from './middleware/authorize';
import { commentRouter } from './routes/commentRoute';

const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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