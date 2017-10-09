"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("./Client");
const xmlrpc = require('binrpc');
const ava_1 = require("ava");
const path = require("path");
const fs = require("fs");
const opts = {
    host: 'localhost',
    port: 10420
};
function fakeSCGI(json, t) {
    const data = require(path.join('../../rpc', json + '.json'));
    return (methodName, params) => {
        t.is(methodName, data.methodName);
        t.deepEqual(params, data.parameters);
        return Promise.resolve(data.response);
    };
}
function readFile(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, buffer) => {
            if (err)
                return reject(err);
            resolve(buffer);
        });
    });
}
ava_1.default('Client.addUrls - works with a correct magnet', (t) => __awaiter(this, void 0, void 0, function* () {
    const client = new Client_1.Client(opts, fakeSCGI('call-addurls-1', t));
    client.addUrls({ urls: ['magnet:foo/bar'], destination: '/home/foo', setAddTime: false }, Object.assign((path, cb) => {
        t.is(path, '/home/foo');
        cb();
    })).then(() => {
        t.pass();
    }).catch((err) => {
        t.fail(err);
    });
}));
ava_1.default('Client.addFile - works with correct file', (t) => __awaiter(this, void 0, void 0, function* () {
    const buffer = yield readFile(path.join('./torrents', 'archlinux-2017.10.01-x86_64.iso.torrent'));
    const client = new Client_1.Client(opts, (method, param) => {
        console.log(method, param);
        return Promise.resolve();
    });
    client.addFiles({
        files: [{
                originalname: 'foo bar test',
                buffer: buffer.toString('base64')
            }],
        setAddTime: false,
        destination: '/home/odahviing/torrents'
    }).then((res) => console.log(res));
}));
