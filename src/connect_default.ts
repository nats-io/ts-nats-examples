import {connect, Client} from "ts-nats";

run();

async function run() {
    // [begin connect_default]
    // will throw an exception if connection fails
    try {
        let nc = await connect();
        // Do something with the connection
        console.log('connected');
        nc.close();
    } catch(ex) {
        console.log('connection failed', ex);
        return;
    }


    // alternatively, you can use the promise api
    let nc1: Client;
    connect()
        .then((c) => {
            nc1 = c;
            // Do something with the connection
            console.log('connected');
            nc1.close();
        })
        .catch((ex) => {
            console.log('connection failed', ex);
            return;
        });
    // [end connect_default]
}


