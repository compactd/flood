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


interface AddFilesOptions {
  files: Buffer[];
  path: string;
  isBasePath: boolean;
  start: boolean;
  tags: string[]
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
   * @param {boolean}  data.start specifies whether it should start on load
   * @return a promise
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
  /**
   * add files buffers to rtorrent
   * @param {Object}   data 
   * @param {Buffer[]} data.files an array of magnets to add to rtorrent
   * @param {string}   data.destination path to destination folder
   * @param {boolean}  data.isBasePath for multi torrents, if true 
   *    the folder which would usually contain the torrent name and contain
   *    the files will be named by the dirname of the path. For single torrents,
   *    it doesn't changes anything. See https://goo.gl/ybsqAX
   * @param {string[]} data.tags an array of tags to add to the new torrents
   * @param {boolean}  data.start specifies whether it should start on load
   * @return a promise
   */
  addFiles (opts: AddFilesOptions) {
    return new Promise((resolve, reject) => { 
      const files = opts.files;
      const path = opts.destination;
      const isBasePath = opts.isBasePath;
      const request = new ClientRequest(this.opts);
      const start = opts.start;
      const tags = opts.tags;
  
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
        fileRequest.addFiles({files: file, path, isBasePath, start, tags});
  
        // Set the callback for only the last request.
        if (index === files.length - 1) {
          fileRequest.onComplete((response, error) => {
            // torrentService.fetchTorrentList();
            if (err) { return reject(err); }
            resolve(response);
          });
        }
  
        fileRequest.send();
      });
    });
  }
}