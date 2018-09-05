import test from "ava";
import {connect, Payload} from "ts-nats";
import {createInbox} from "../node_modules/ts-nats/lib/util";

test('subscribe_async', async (t) => {
    let nc = await connect({
        url: "nats://demo.nats.io:4222"
    });
    // [begin subscribe_async]
    nc.subscribe("updates", (err, msg) => {
        if(err) {
            console.log('error', err);
        } else {
            t.log(msg.data);
        }
    });
    // [end subscribe_async]
    nc.publish("updates", "All is Well!");
    await nc.flush();
    nc.close();
    t.pass();
});

test('subscribe_w_reply', async(t) => {
    let nc = await connect({
        url: "nats://demo.nats.io:4222"
    });

    // [begin subscribe_w_reply]
    // set up a subscription to process a request
    await nc.subscribe('time', (err, msg) => {
        if (msg.reply) {
            nc.publish(msg.reply, new Date().toLocaleTimeString());
        } else {
            t.log('got a request for the time, but no reply subject was set.');
        }
    });
    // [end subscribe_w_reply]

    let msg = await nc.request('time', 1000);
    t.log('the time is', msg.data);
    nc.close();
    t.pass();
});

test('unsubscribe', async(t) => {
    let nc = await connect({
        url: "nats://demo.nats.io:4222"
    });

    // [begin unsubscribe]
    // set up a subscription to process a request
    let sub = await nc.subscribe(createInbox(), (err, msg) => {
        if (msg.reply) {
            nc.publish(msg.reply, new Date().toLocaleTimeString());
        } else {
            t.log('got a request for the time, but no reply subject was set.');
        }
    });

    // without arguments the subscription will cancel when the server receives it
    // you can also specify how many messages are expected by the subscription
    sub.unsubscribe();
    // [end unsubscribe]
    nc.close();
    t.pass();
});

test('subscribe_json', async(t) => {
    // [begin subscribe_json]
    let nc = await connect({
        url: "nats://demo.nats.io:4222",
        payload: Payload.JSON
    });

    nc.subscribe('updates', (err, msg) => {
        t.log('got message:', msg.data ? msg.data : "no payload");
    });

    // [end subscribe_json]
    await nc.flush();
    nc.publish('updates', {ticker: 'TSLA', price: 355.49});

    await nc.flush();
    nc.close();
    t.pass();
});

test('unsubscribe_auto', async(t) => {
    let nc = await connect({
        url: "nats://demo.nats.io:4222"
    });

    // [begin unsubscribe_auto]
    // `max` specifies the number of messages that the server will forward.
    // The server will auto-cancel.
    let opts = {max: 10};
    let sub = await nc.subscribe(createInbox(), (err, msg) => {
        t.log(msg.data);
    }, opts);

    // another way after 10 messages
    let sub2 = await nc.subscribe(createInbox(), (err, msg) => {
        t.log(msg.data);
    });
    // if the subscription already received 10 messages, the handler
    // won't get any more messages
    sub2.unsubscribe(10);
    // [end unsubscribe_auto]
    nc.close();
    t.pass();
});


test('subscribe_star', async(t) => {
    let nc = await connect({
        url: "nats://demo.nats.io:4222"});

    // [begin subscribe_star]
    await nc.subscribe('time.us.*', (err, msg) => {
        // converting timezones correctly in node requires a library
        // this doesn't take into account *many* things.
        let time = "";
        switch (msg.subject) {
            case 'time.us.east':
                time = new Date().toLocaleTimeString("en-us", {timeZone: "America/New_York"});
                break;
            case 'time.us.central':
                time = new Date().toLocaleTimeString("en-us", {timeZone: "America/Chicago"});
                break;
            case 'time.us.mountain':
                time = new Date().toLocaleTimeString("en-us", {timeZone: "America/Denver"});
                break;
            case 'time.us.west':
                time = new Date().toLocaleTimeString("en-us", {timeZone: "America/Los_Angeles"});
                break;
            default:
                time = "I don't know what you are talking about Willis";
        }
        console.log(msg.subject, time);
    });
    // [end subscribe_star]
    nc.publish('time.us.east');
    nc.publish('time.us.central');
    nc.publish('time.us.mountain');
    nc.publish('time.us.west');
    nc.flush();
    nc.close();
    t.pass();
});

test('subscribe_arrow', async(t) => {
    let nc = await connect({
        url: "nats://demo.nats.io:4222"});

    // [begin subscribe_arrow]
    await nc.subscribe('time.>', (err, msg) => {
        // converting timezones correctly in node requires a library
        // this doesn't take into account *many* things.
        let time = "";
        switch (msg.subject) {
            case 'time.us.east':
                time = new Date().toLocaleTimeString("en-us", {timeZone: "America/New_York"});
                break;
            case 'time.us.central':
                time = new Date().toLocaleTimeString("en-us", {timeZone: "America/Chicago"});
                break;
            case 'time.us.mountain':
                time = new Date().toLocaleTimeString("en-us", {timeZone: "America/Denver"});
                break;
            case 'time.us.west':
                time = new Date().toLocaleTimeString("en-us", {timeZone: "America/Los_Angeles"});
                break;
            default:
                time = "I don't know what you are talking about Willis";
        }
        t.log(msg.subject, time);
    });
    // [end subscribe_arrow]
    nc.publish('time.us.east');
    nc.publish('time.us.central');
    nc.publish('time.us.mountain');
    nc.publish('time.us.west');
    nc.flush();
    nc.close();
    t.pass();
});

test('subscribe_queue', async(t) => {
    let nc = await connect({
        url: "nats://demo.nats.io:4222"});

    // [begin subscribe_queue]
    await nc.subscribe('updates', (err, msg) => {
        t.log('worker got message', msg.data);
    }, {queue: "workers"});
    // [end subscribe_queue]
    nc.flush();
    nc.close();
    t.pass();
});


test('drain_sub', async(t) => {
    let nc = await connect({
        url: "nats://demo.nats.io:4222"});

    // [begin drain_sub]
    let sub = await nc.subscribe('updates', (err, msg) => {
        t.log('worker got message', msg.data);
    }, {queue: "workers"});
    // [end drain_sub]
    nc.flush();

    await sub.drain();
    nc.close();
    t.pass();
});


test('no_echo', async(t) => {
    // [begin no_echo]
    let nc = await connect({
        url: "nats://demo.nats.io:4222", noEcho: true});
    // [end no_echo]

    let sub = await nc.subscribe('updates', (err, msg) => {
        t.log('worker got message', msg.data);
    }, {queue: "workers"});
    nc.flush();

    await sub.drain();
    nc.close();
    t.pass();
});

test('subscribe_sync', (t) => {
    // [begin subscribe_sync]
    // ts-nats subscriptions are always async.
    // [end subscribe_sync]
    t.pass();
});