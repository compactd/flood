const ClientRequest = require('../models/ClientRequest') as any;

type ClientOptions = {
  port: number;
  host: string;
  socket?: false;
} | {
  socket: true;
  socketPath: string;
}

interface AddURLsData {
  urls: string[];
  destination?: string;
  start?: boolean;
  isBasePath?: boolean;
  tags?: string[];
}

/**
 * Represents a rTorrent client
 */
class Client {
  opts: ClientOptions;
  /**
   * creates a new client instance
   * @param {Object}  opts options to setup rtorrent connection
   * @param {number}  opts.port the rtorrent port
   * @param {string}  opts.host rtorrent hostname
   * @param {boolean} [opts.socket] use a socket instead of a server
   * @param {string}  [opts.socketPath] specifies rtorrent socket path
   */
  constructor (opts: ClientOptions) {
    this.opts = opts;
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
   * @param {boolean}  start specifies whether it should start on load
   */
  addUrls (data: AddURLsData) {
    return new Promise((resolve, reject) => {

      const urls = data.urls;
      const path = data.destination;
      const isBasePath = data.isBasePath;
      const start = data.start;
      const tags = data.tags;
      const request = new ClientRequest(this.opts);
  
      request.createDirectory({path});
      request.addURLs({urls, path, isBasePath, start, tags});
      request.onComplete((data: any, err: any) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
      request.send();
    });
  }

  addFiles ()
}