declare const ClientRequest: any;
declare type ClientOptions = {
    port: number;
    host: string;
    socket?: false;
} | {
    socket: true;
    socketPath: string;
};
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
declare class Client {
    opts: ClientOptions;
    /**
     * creates a new client instance
     * @param {Object}  opts options to setup rtorrent connection
     * @param {number}  opts.port the rtorrent port
     * @param {string}  opts.host rtorrent hostname
     * @param {boolean} [opts.socket] use a socket instead of a server
     * @param {string}  [opts.socketPath] specifies rtorrent socket path
     */
    constructor(opts: ClientOptions);
    /**
     * add a few URLs to rTorrent
     * @param {Object} data
     * @param {des}
     */
    addUrls(data: AddURLsData): Promise<{}>;
}
