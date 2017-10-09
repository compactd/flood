/// <reference types="node" />
/// <reference types="mkdirp" />
import * as mkdirp from 'mkdirp';
export declare type ClientOptions = {
    port: number;
    host: string;
    socket?: false;
} | {
    socket: true;
    socketPath: string;
};
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
export declare type MethodCall = (methodName: string, params: string[], opts: {
    host: string;
    port: number;
}) => Promise<any>;
/**
 * Represents a rTorrent client
 */
export declare class Client {
    private methodCall;
    private opts;
    /**
     * creates a new client instance
     * @param {Object}  opts options to setup rtorrent connection
     * @param {number}  opts.port the rtorrent port
     * @param {string}  opts.host rtorrent hostname
     * @param {boolean} [opts.socket] use a socket instead of a server
     * @param {string}  [opts.socketPath] specifies rtorrent socket path
     */
    constructor(opts: ClientOptions, methodCall: MethodCall);
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
    addUrls(data: AddURLsData, mkdir?: typeof mkdirp): Promise<{}>;
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
     * @param {boolean}  data.setAddTime whether to include d.custom.set=addtime,
     * @return a promise
     */
    addFiles(opts: AddFilesOptions): Promise<{}>;
    getTorrent(): void;
}
