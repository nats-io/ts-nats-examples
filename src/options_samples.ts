import {connect} from "ts-nats";
import test from "ava";

test('ping_20s', async (t) => {
    // [begin ping_20s]
    // will throw an exception if connection fails
    let nc = await connect({
        pingInterval: 20*2000, //20s
        url: "nats://demo.nats.io:4222"
    });
    nc.close();
    // [end ping_20s]
    t.pass();
});

test('ping_5', async (t) => {
    // [begin ping_5]
    // will throw an exception if connection fails
    let nc = await connect({
        maxPingOut: 5,
        url: "nats://demo.nats.io:4222"
    });
    nc.close();
    // [end ping_5]
    t.pass();
});

test('connect_pedantic', async (t) => {
    // [begin connect_pedantic]
    // will throw an exception if connection fails
    let nc = await connect({
        url: "nats://demo.nats.io:4222",
        pedantic: true
    });

    nc.close();
    // [end connect_pedantic]
    t.pass();
});

test('connect_verbose', async (t) => {
    // [begin connect_verbose]
    // will throw an exception if connection fails
    let nc = await connect({
        url: "nats://demo.nats.io:4222",
        verbose: true
    });

    nc.close();
    // [end connect_verbose]
    t.pass();
});

test('connect_name', async (t) => {
    // [begin connect_name]
    // will throw an exception if connection fails
    let nc = await connect({
        url: "nats://demo.nats.io:4222",
        name: "my-connection"
    });

    nc.close();
    // [end connect_name]
    t.pass();
});
