import test from "ava";
import {connect} from "ts-nats";
import {join} from "path";
import {readFileSync} from "fs";
import {SC, startServer, stopServer} from "./helpers/nats_server_control";

let serverCertPath = join(__dirname, "../src/helpers/certs/server-cert.pem");
let serverKeyPath = join(__dirname, "../src/helpers/certs/server-key.pem");
let caCertPath = join(__dirname, "../src/helpers/certs/ca.pem");
let clientCertPath = join(__dirname, "../src/helpers/certs/client-cert.pem");
let clientKeyPath = join(__dirname, "../src/helpers/certs/client-key.pem");

test.before(async (t) => {
    t.log(__dirname);

    let server = await startServer("", ["--tlscert", serverCertPath, "--tlskey", serverKeyPath]);
    t.context = {server: server};
});

test.after.always((t) => {
    let sc = t.context as SC;
    stopServer(sc.server);
});

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

test('connect_tls', async (t) => {
    let sc = t.context as SC;
    let url = sc.server.nats;
    // [begin connect_tls]
    let caCert = readFileSync(caCertPath);
    let clientCert = readFileSync(clientCertPath);
    let clientKey = readFileSync(clientKeyPath);
    let nc = await connect({
        url: url,
        tls: {
            ca: [caCert],
            key: [clientKey],
            cert: [clientCert]
        }
    });
    // [end connect_tls]
    await nc.flush();
    t.false(nc.isClosed());
    nc.close();
    t.pass()
});