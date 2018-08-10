import test from "ava";
import {connect, Payload} from "ts-nats";
import {createInbox} from "../node_modules/ts-nats/lib/util";

test('publish_bytes', async(t) => {
    // [begin publish_bytes]
    let nc = await connect({
        url: "nats://demo.nats.io:4222",
        payload: Payload.BINARY
    });

    let buf = Buffer.allocUnsafe(12);
    buf.fill("Hello world!");
    nc.publish('updates', buf);
    // [end publish_bytes]
    await nc.flush();
    nc.close();
    t.pass();
});

test('publish_json', async(t) => {
    // [begin publish_json]
    let nc = await connect({
        url: "nats://demo.nats.io:4222",
        payload: Payload.JSON
    });

    nc.publish('updates', {ticker: 'TSLA', price: 355.49});
    // [end publish_json]

    await nc.flush();
    nc.close();
    t.pass();
});

test('publish_with_reply',  (t) => {
    return new Promise(async(resolve, reject) => {
        // [begin publish_with_reply]
        let nc = await connect({
            url: "nats://demo.nats.io:4222"
        });

        // set up a subscription to process the request
        await nc.subscribe('time', (err, msg) => {
            if (err) {
                // this example is running inside of a promise
                reject();
                return;
            }
            if (msg.reply) {
                nc.publish(msg.reply, new Date().toLocaleTimeString());
            }
        });

        // generate a inbox for the replies
        let inbox = createInbox();
        await nc.subscribe(inbox, (err, msg) => {
            t.log('the time is', msg.data);
            // this example is running inside of a promise
            nc.close();
            resolve();
        });

        nc.publish('time', "", inbox);
        // [end publish_with_reply]
        t.pass();
    });
});

test('request_reply', async (t) => {
    // [begin request_reply]
    let nc = await connect({
        url: "nats://demo.nats.io:4222"
    });

    // set up a subscription to process the request
    await nc.subscribe('time', (err, msg) => {
        if (msg.reply) {
            nc.publish(msg.reply, new Date().toLocaleTimeString());
        }
    });

    let msg = await nc.request('time', 1000);
    t.log('the time is', msg.data);
    nc.close();
    // [end request_reply]
    t.pass();
});

test('flush', async (t) => {
    // [begin flush]
    let nc = await connect({
        url: "nats://demo.nats.io:4222"
    });

    // you can use flush to trigger something in your
    // application once the round-trip to the server finishes
    let start = Date.now();
    nc.flush(() => {
        t.log('round trip completed in', Date.now() - start, 'ms');
    });

    // Another use is to 'know' when the server received
    // things that you sent to it. Typically this is not a
    // great idea unless you are doing tests, etc. The
    // nats client is very good at minimizing kernel calls
    // achieving great throughput.
    nc.publish('foo');

    // If you need to know if someone got your message, the
    // only way to know is by publishing a request and having
    // someone answer!
    await nc.flush();



    nc.close();
    // [end flush]
    t.pass();
});