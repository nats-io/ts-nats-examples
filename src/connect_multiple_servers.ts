import {connect} from "ts-nats";

run();

async function run() {
    // [begin connect_multiple]
    // will throw an exception if connection fails
    try {
        let nc = await connect({servers: ["nats://demo.nats.io:4222", "nats://localhost:4222"]});
        // Do something with the connection
        console.log('connected');
        nc.close();
    } catch(ex) {
        console.log('connection failed', ex);
        return;
    }
    // [end connect_multiple]
}


