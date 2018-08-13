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
    buf.fill("All is Well");
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

    nc.publish('updates', {ticker: 'GOOG', price: 1200});
    // [end publish_json]

    await nc.flush();
    nc.close();
    t.pass();
});

test('publish_with_reply',  (t) => {
    return new Promise(async(resolve, reject) => {
        let nc = await connect({
            url: "nats://demo.nats.io:4222"
        });
        // [begin publish_with_reply]
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

        // create a subscription subject that the responding send replies to
        let inbox = createInbox();
        await nc.subscribe(inbox, (err, msg) => {
            t.log('the time is', msg.data);
            // this example is running inside of a promise
            nc.close();
            resolve();
        }, {max: 1});

        nc.publish('time', "", inbox);
        // [end publish_with_reply]
        t.pass();
    });
});

test('request_reply', async (t) => {
    let nc = await connect({
        url: "nats://demo.nats.io:4222"
    });

    // set up a subscription to process the request
    await nc.subscribe('time', (err, msg) => {
        if (msg.reply) {
            nc.publish(msg.reply, new Date().toLocaleTimeString());
        }
    });

    // [begin request_reply]
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

    // you can use flush to trigger a function in your
    // application once the round-trip to the server finishes
    let start = Date.now();
    nc.flush(() => {
        t.log('round trip completed in', Date.now() - start, 'ms');
    });

    nc.publish('foo');

    // another way, simply wait for the promise to resolve
    await nc.flush();

    nc.close();
    // [end flush]
    t.pass();
});

test('wildcard_tester', async(t) => {
    let nc = await connect({
        url: "nats://demo.nats.io:4222"});

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

    // [begin wildcard_tester]
    nc.publish('time.us.east');
    nc.publish('time.us.central');
    nc.publish('time.us.mountain');
    nc.publish('time.us.west');
    // [end subscribe_arrow]
    
    nc.flush();
    nc.close();
    t.pass();
});