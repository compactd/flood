import {Client} from './Client';
const xmlrpc = require('binrpc') as any;
import test, {TestContext} from 'ava';
import * as path from 'path';
import * as fs from 'fs';

const opts = {
  host: 'localhost',
  port: 10420
};

interface SCGIData {
  methodName: string,
  parameters: any;
  response: any;
}

function fakeSCGI (json: string, t: TestContext) {
  const data = require(path.join('../../rpc', json + '.json')) as SCGIData;
  return (methodName: string, params: any) => {
    t.is(methodName, data.methodName);
    t.deepEqual(params, data.parameters);
    return Promise.resolve(data.response);
  }
}

function readFile (file: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, buffer) => {
      if (err) return reject(err);
      resolve(buffer);
    });
  })
}

test('Client.addUrls - works with a correct magnet', async t => {
  const client = new Client(opts, fakeSCGI('call-addurls-1', t));
  
  client.addUrls({urls: ['magnet:foo/bar'], destination: '/home/foo', setAddTime: false}, Object.assign((path: string, cb: any) => {
    t.is(path, '/home/foo');
    cb()
  })).then(() => {
    t.pass();
  }).catch((err) => {
    t.fail(err);
  });
});

test('Client.addFile - works with correct file', async t => {
  const buffer = await readFile(path.join('./torrents', 'archlinux-2017.10.01-x86_64.iso.torrent'));
  const client = new Client(opts, (method, param) => {
    console.log(method, param);
    return Promise.resolve();
  });

  client.addFiles({
    files: [{
      originalname: 'foo bar test',
      buffer: buffer.toString('base64') as any
    }],
    setAddTime: false,
    destination: '/home/odahviing/torrents'
  }).then((res) => console.log(res));
  
})