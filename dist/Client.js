const ClientRequest = require('../models/ClientRequest');
/**
 * Represents a rTorrent client
 */
class Client {
    /**
     * creates a new client instance
     * @param {Object}  opts options to setup rtorrent connection
     * @param {number}  opts.port the rtorrent port
     * @param {string}  opts.host rtorrent hostname
     * @param {boolean} [opts.socket] use a socket instead of a server
     * @param {string}  [opts.socketPath] specifies rtorrent socket path
     */
    constructor(opts) {
        this.opts = opts;
    }
    /**
     * add a few URLs to rTorrent
     * @param {Object} data
     * @param {des}
     */
    addUrls(data) {
        return new Promise((resolve, reject) => {
            const urls = data.urls;
            const path = data.destination;
            const isBasePath = data.isBasePath;
            const start = data.start;
            const tags = data.tags;
            const request = new ClientRequest(this.opts);
            request.createDirectory({ path });
            request.addURLs({ urls, path, isBasePath, start, tags });
            request.onComplete((data, err) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
            request.send();
        });
    }
}
