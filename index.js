const express = require('express');
const userRouter = require('./api/routes/userRouter');
const errorHandler = require('./api/middlewares/handle-error')

const app = express();

app.use(express.json());
// app.use('/', (req, res) => {
//     return res.status(200).json({"msg": "OK"});
// })
app.use('/', userRouter);
app.use(errorHandler);

app.listen(8001, () => {
    console.log('Auth service listening on 8001')
})