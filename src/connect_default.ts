import {connect, NatsConnectionOptions, Payload, SubEvent, Client} from "ts-nats";

async function run() {
    // [begin connect_default]
    // will throw an exception if connection fails
    let nc = await connect();

    // Do something with the connection

    nc.close();


    // alternatively, you can use the promise api
    let nc1: Client;
    connect()
        .then((c) => {
            nc1 = c;
        })
        .catch((err) => {
            console.log('connection failed', err);
            return;
        });

    // Do something with the connection

    if(nc1) {
        nc1.close();
    }
    // [end connect_default]
}


