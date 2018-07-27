import {connect} from "ts-nats";
let log = require('why-is-node-running');

connect({url: "nats://demo.nats.io:4223", reconnect: false})
    .then((nc) => {
        nc.publish('foo');
    })
    .catch((ex) => {
        console.log('error connecting', ex);
    });

    setTimeout(() => {
        log();
    }, 1000);

