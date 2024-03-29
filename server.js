const PROTO_PATH = __dirname + '/proto/employee.proto';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const _ = require('lodash');

let {employees} = require('./data.js');

let packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
);

let employee_proto = grpc.loadPackageDefinition(packageDefinition).employee;

function getDetails(call, callback) {
    callback(null, 
    {
        message: _.find(employees, { id: call.request.id })
    });
}

function main() {
    let server = new grpc.Server();
    server.addService(employee_proto.Employee.service, {getDetails: getDetails});
    server.bindAsync('0.0.0.0:4500', grpc.ServerCredentials.createInsecure(),()=>{
        server.start();
    });
}

main();