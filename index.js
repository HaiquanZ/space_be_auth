const express = require('express');
const userRouter = require('./api/routes/userRouter');
const calendarRouter = require('./api/routes/calendarRouter')
const errorHandler = require('./api/middlewares/handle-error')
const app = express();

//grpc
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync('C:/grpc/helloworld.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

// const client = new hello_proto.Greeter('localhost:50051', grpc.credentials.createInsecure());
// client.SayHello({ name: 'world' }, (err, response) => {
//     if (err) console.error(err);
//     console.log('Greeting:', response.message);
//   });
//

app.use(express.json());
// app.use('/', (req, res) => {
//     return res.status(200).json({"msg": "OK"});
// })
app.use('/', userRouter);
app.use('/calendar', calendarRouter);
app.use(errorHandler);



app.listen(8001, () => {
    console.log('Auth service listening on 8001')
})