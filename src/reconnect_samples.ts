import {connect} from "ts-nats";
import test from "ava";


test('reconnect_no_random', async (t) => {
    // [begin reconnect_no_random]
    // will throw an exception if connection fails
    let nc = await connect({
        noRandomize: false,
        servers: ["nats://127.0.0.1:4443",
            "nats://demo.nats.io:4222"
        ]
    });
    nc.close();
    // [end reconnect_no_random]
    t.pass();
});

test('reconnect_none', async (t) => {
    // [begin reconnect_none]
    // will throw an exception if connection fails
    let nc = await connect({
        reconnect: false,
        servers: ["nats://demo.nats.io:4222"]
    });
    nc.close();
    // [end reconnect_none]
    t.pass();
});


test('reconnect_10s', async (t) => {
    // [begin reconnect_10s]
    // will throw an exception if connection fails
    let nc = await connect({
        reconnectTimeWait: 10*1000, //10s
        servers: ["nats://demo.nats.io:4222"]
    });
    nc.close();
    // [end reconnect_10s]
    t.pass();
});

test('reconnect_10x', async (t) => {
    // [begin reconnect_10x]
    // will throw an exception if connection fails
    let nc = await connect({
        maxReconnectAttempts: 10,
        servers: ["nats://demo.nats.io:4222"]
    });
    nc.close();
    // [end reconnect_10x]
    t.pass();
});

test('reconnect_event', async (t) => {
    // [begin reconnect_event]
    // will throw an exception if connection fails
    let nc = await connect({
        maxReconnectAttempts: 10,
        servers: ["nats://demo.nats.io:4222"]
    });
    // first argument is the connection (same as nc in this case)
    // second argument is the url of the server where the client
    // connected
    nc.on('reconnect', (conn, server) => {
        console.log('reconnected to', server);
    });
    nc.close();
    // [end reconnect_event]
    t.pass();
});


test('reconnect_5mb', (t) => {
    // [begin reconnect_5mb]
    // Reconnect buffer size is not configurable on ts-nats
    // [end reconnect_5mb]
    t.pass();
});

