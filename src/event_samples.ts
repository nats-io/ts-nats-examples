import test from "ava";
import {connect} from "ts-nats";

test('connection_listener', async(t) => {
    let nc = await connect({
        url: "nats://demo.nats.io:4222"});
    // [begin connection_listener]
    // connect will happen once - the first connect
    nc.on('connect', (nc) => {
        // nc is the connection that connected
        t.log('client connected');
    });

    nc.on('disconnect', (url) => {
        // nc is the connection that reconnected
        t.log('disconnected from', url);
    });

    nc.on('reconnecting', (url) => {
        t.log('reconnecting to', url);
    });

    nc.on('reconnect', (nc, url) => {
        // nc is the connection that reconnected
        t.log('reconnected to', url);
    });
    // [end connection_listener]
    nc.close();
    t.pass();
});


test('servers_added', async(t) => {
    let nc = await connect({
        url: "nats://demo.nats.io:4222"});
    // [begin servers_added]
    nc.on('serversChanged', (ce) => {
        t.log('servers changed\n', 'added: ',ce.added, 'removed:', ce.removed);
    });
    // [end servers_added]
    nc.close();
    t.pass();
});

test('error_listener', async(t) => {
    let nc = await connect({
        url: "nats://demo.nats.io:4222"});
    // [begin error_listener]
    // on node you *must* register an error listener. If not registered
    // the library emits an 'error' event, the node process will exit.
    nc.on('error', (err) => {
        t.log('client got an out of band error:', err);
    });
    // [end error_listener]
    nc.close();
    t.pass();
});

test('connect_status', async(t) => {
    let nc = await connect({
        url: "nats://demo.nats.io:4222"});
    // [begin connect_status]
    if(nc.isClosed()) {
        t.log('the client is closed');
    } else {
        t.log('the client is running');
    }
    // [end connect_status]
    nc.close();
    t.pass();
});