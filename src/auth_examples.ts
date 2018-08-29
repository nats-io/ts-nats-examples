import test from "ava";
import {Server, startServer, stopServer} from "./helpers/nats_server_control";
import {Client, connect} from "ts-nats";
import {URL} from "url";

let servers : Server[] = [];


test.after.always((t) => {
    // @ts-ignore
    servers.forEach((s) => {
        stopServer(s);
    });
});


test('connect_userpass', async (t) => {
    let server = await startServer("", ["--user", "myname", "--pass", "password"]);
    servers.push(server);

    // [begin connect_userpass]
    let nc = await connect({url: server.nats, user: "myname", pass: "password"});
    // [end connect_userpass]
    nc.close();
    t.pass();
});


test('connect_userpass_url', async (t) => {
    let server = await startServer("", ["--user", "myname", "--pass", "password"]);
    servers.push(server);
    let port = new URL(server.ports.nats[0]).port;

    // [begin connect_userpass_url]
    let url = `nats://myname:password@127.0.0.1:${port}`;
    let nc = await connect({url: url});
    // [end connect_userpass_url]
    nc.close();
    t.pass();
});

test('connect_token_url', async (t) => {
    let server = await startServer("", ["--auth", "mytoken!"]);
    servers.push(server);
    let port = new URL(server.ports.nats[0]).port;

    // [begin connect_token_url]
    let url = `nats://:mytoken!@127.0.0.1:${port}`;
    let nc = await connect({url: url});
    // [end connect_token_url]
    nc.close();
    t.pass();
});

test('connect_token', async (t) => {
    let server = await startServer("", ["--auth", "mytoken!"]);
    servers.push(server);
    // [begin connect_token]
    let nc = await connect({url: server.nats, token: "mytoken"});
    // [end connect_token]
    nc.close();
    t.pass();
});
