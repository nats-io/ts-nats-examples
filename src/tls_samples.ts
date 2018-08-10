import test from "ava";
import {connect} from "ts-nats";

test('connect_tls_url', async (t) => {
    // [begin connect_tls_url]
    // will throw an exception if connection fails
    let nc = await connect({
        url: "tls://demo.nats.io:4443"
    });

    nc.close();
    // [end connect_tls_url]
    t.pass();
});