const ClientRequest = require('../models/ClientRequest') as any;

import * as mkdirp from 'mkdirp';


type Peer = {
  index: number;
  address: string;
  completedPercent: number;
  clientVersion: string;
  downloadRate: number;
  downloadTotal: number;
  uploadRate: number;
  uploadTotal: number;
  id: string;
  peerRate: number;
  peerTotal: number;
  isEncrypted: boolean;
  country: string;
}

type Tracker = {
  index: number;
  group: number;
  url: string;
  minInterval: number;
  normalInterval: number;
  type: number;
}
type TrackerFile = {
  index: number;
  path: string;
  priority: number;
  sizeBytes: number;
  filename: string;
  percentComplete: number;
}

type TorrentDetails = {
  peers: Peer[];
  trackers: Tracker[];
  fileTree: {
    files: TrackerFile[];
    directories: {
       [name: string]: {
         files: TrackerFile[]
       }
    }
  }
}

export type ClientOptions = {
  port: number;
  host: string;
  socket?: false;
} | {
  socket: true;
  socketPath: string;
}

export interface AddURLsData {
  urls: string[];
  destination?: string;
  start?: boolean;
  isBasePath?: boolean;
  tags?: string[];
  setAddTime?: boolean;
}


export interface AddFilesOptions {
  files: {
    originalname: string;
    buffer: Buffer;
  }[];
  destination: string;
  isBasePath?: boolean;
  start?: boolean;
  tags?: string[] | string;
  setAddTime?: boolean;
}

export type MethodCall = (methodName: string, params: string[], opts: {host: string, port: number}) => Promise<any>;

/**
 * Represents a rTorrent client
 */
export class Client {
  private methodCall: MethodCall;
  private opts: ClientOptions;
  /**
   * creates a new client instance
   * @param {Object}  opts options to setup rtorrent connection
   * @param {number}  opts.port the rtorrent port
   * @param {string}  opts.host rtorrent hostname
   * @param {boolean} [opts.socket] use a socket instead of a server
   * @param {string}  [opts.socketPath] specifies rtorrent socket path
   */
  constructor (opts: ClientOptions, methodCall: MethodCall) {
    this.opts = opts;
    this.methodCall = methodCall;
  }

  /**
   * add a few URLs to rTorrent
   * @param {Object}   data 
   * @param {string[]} data.urls an array of magnets to add to rtorrent
   * @param {string}   data.destination path to destination folder
   * @param {boolean}  data.isBasePath for multi torrents, if true 
   *    the folder which would usually contain the torrent name and contain
   *    the files will be named by the dirname of the path. For single torrents,
   *    it doesn't changes anything. See https://goo.gl/ybsqAX
   * @param {string[]} data.tags an array of tags to add to the new torrents
   * @param {boolean}  data.start specifies whether it should start on load
   * @param {boolean}  data.setAddTime whether to include d.custom.set=addtime,
   * @return a promise
   */
  addUrls (data: AddURLsData, mkdir?: typeof mkdirp) {
    return new Promise((resolve, reject) => {

      const urls = data.urls;
      const path = data.destination;
      const isBasePath = data.isBasePath;
      const start = data.start;
      const tags = data.tags;
      const setAddTime = data.setAddTime !== false;
      const request = new ClientRequest(this.opts, this.methodCall);
  
      request.createDirectory({path}, mkdir);
      request.addURLs({urls, path, isBasePath, start, tags, setAddTime});
      request.onComplete((data: any, err: any) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
      request.send();
    });
  }
  /**
   * add files buffers to rtorrent
   * @param {Object}   data 
   * @param {(Buffer | string)[]} data.files an array of buffers or base64 string
   * @param {string}   data.destination path to destination folder
   * @param {boolean}  data.isBasePath for multi torrents, if true 
   *    the folder which would usually contain the torrent name and contain
   *    the files will be named by the dirname of the path. For single torrents,
   *    it doesn't changes anything. See https://goo.gl/ybsqAX
   * @param {string[]} data.tags an array of tags to add to the new torrents
   * @param {boolean}  data.start specifies whether it should start on load
   * @param {boolean}  data.setAddTime whether to include d.custom.set=addtime,
   * @return a promise
   */
  addFiles (opts: AddFilesOptions) {
    return new Promise((resolve, reject) => { 
      const files = opts.files;
      const path = opts.destination;
      const isBasePath = opts.isBasePath;
      const request = new ClientRequest(this.opts);
      const start = opts.start !== false;
      const setAddTime = opts.setAddTime !== false;

      let tags = opts.tags || [];
  
      if (!Array.isArray(tags)) {
        tags = tags.split(',');
      }
  
      request.createDirectory({path});
      request.send();
  
      // Each torrent is sent individually because rTorrent accepts a total
      // filesize of 524 kilobytes or less. This allows the user to send many
      // torrent files reliably.
      files.forEach((file, index) => {
        file.originalname = encodeURIComponent(file.originalname);
        let fileRequest = new ClientRequest();
        fileRequest.addFiles({files: file, path, isBasePath, start, tags, setAddTime});
  
        // Set the callback for only the last request.
        if (index === files.length - 1) {
          fileRequest.onComplete((response: any, err: any) => {
            // torrentService.fetchTorrentList();
            if (err) { return reject(err); }
            resolve(response);
          });
        }
  
        fileRequest.send();
      });
    });
  }
  getTorrent () {

  }
}

class Torrent {
  private opts: ClientOptions;
  private hash: string;
  constructor (opts: ClientOptions, hash: string) {
    this.opts = opts;
    this.hash = hash;
  }
}