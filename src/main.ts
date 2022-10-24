import express from 'express';
import bodyParser from 'body-parser';
import { userRouter } from './routes/userRoute';

const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/Users', userRouter);
app.use(express.static('public'));

app.get('/', (req, res, next) => {
    res.sendFile(path.join(process.cwd(), 'public/index.html'));
})

app.get('*',function (req, res) {
    res.redirect('/');
});

app.listen(3000);