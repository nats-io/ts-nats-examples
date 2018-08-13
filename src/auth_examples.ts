import test from "ava";
import {Server, startServer, stopServer} from "./helpers/nats_server_control";
import {Client, connect} from "ts-nats";
import * as Url from "url";
import {URL} from "url";

let servers : Server[] = [];


test.after.always((t) => {
    // @ts-ignore
    servers.forEach((s) => {
        stopServer(s);
    });
});


test('connect_userpass', async (t) => {
    let server = await startServer("", ["--user", "me", "--pass", "t0P-s3cr3t"]);
    servers.push(server);

    // [begin connect_userpass]
    let nc = await connect({url: server.nats, user: "me", pass: "t0P-s3cr3t"});
    // [end connect_userpass]
    nc.close();
    t.pass();
});


test('connect_userpass_url', async (t) => {
    let server = await startServer("", ["--user", "me", "--pass", "t0P-s3cr3t"]);
    servers.push(server);
    let port = new URL(server.ports.nats[0]).port;

    // [begin connect_userpass_url]
    let url = `nats://me:t0P-s3cr3t@127.0.0.1:${port}`;
    let nc = await connect({url: url});
    // [end connect_userpass_url]
    nc.close();
    t.pass();
});

test('connect_token_url', async (t) => {
    let server = await startServer("", ["--auth", "s3cretT0ken!"]);
    servers.push(server);
    let port = new URL(server.ports.nats[0]).port;

    // [begin connect_token_url]
    let url = `nats://:s3cretT0ken!@127.0.0.1:${port}`;
    let nc = await connect({url: url});
    // [end connect_token_url]
    nc.close();
    t.pass();
});

test('connect_token', async (t) => {
    let server = await startServer("", ["--auth", "s3cretT0ken!"]);
    servers.push(server);
    // [begin connect_userpass_url]
    let nc = await connect({url: server.nats, token: "s3cretT0ken"});
    // [end connect_userpass_url]
    nc.close();
    t.pass();
});