import {connect, Client} from "ts-nats";
import test from "ava";
import {startServer, stopServer} from "./helpers/nats_server_control";

test.before(async (t) => {
    let server = await startServer("", ["-p", "4222"]);
    t.context = {server: server};
});

test.after.always((t) => {
    // @ts-ignore
    stopServer(t.context.server);
});

test('connect_default', async (t) => {
    // [begin connect_default]
    // will throw an exception if connection fails
    let nc = await connect();
    // Do something with the connection

    // When done close it
    nc.close();


    // alternatively, you can use the Promise pattern
    let nc1: Client;
    connect()
        .then((c) => {
            nc1 = c;
            // Do something with the connection
            console.log('connected');
            nc1.close();
        });
        // add a .catch/.finally
    // [end connect_default]

    t.pass();
});

test('connect_url', async(t) => {
    // [begin connect_url]
    // will throw an exception if connection fails
        let nc = await connect("nats://demo.nats.io:4222");
        // Do something with the connection

        // Close the connection
        nc.close();
    // [end connect_url]
    t.pass();
});


test('connect_multiple', async(t) => {
    // [begin connect_multiple]
    // will throw an exception if connection fails
    let nc = await connect({servers: ["nats://demo.nats.io:4222", "nats://localhost:4222"]});
    // Do something with the connection

    // When done close it
    nc.close();
    // [end connect_multiple]
    t.pass();
});

