import {EventEmitter} from 'events';
const serverEventTypes = require('../../shared/constants/serverEventTypes');
const TorrentService = require('../services/torrentService');
const torrentServiceEvents = require('../constants/torrentServiceEvents');

export interface TorrentItem {
  hash: string;
  name: string;
  message: string;
  state: string;
  isActive: boolean;
  isComplete: boolean;
  isHashChecking: boolean;
  isOpen: boolean;
  priority: string;
  upRate: number;
  upTotal: number;
  downRate: number;
  downTotal: number;
  ratio: number;
  bytesDone: number;
  sizeBytes: number;
  peersConnected: number;
  directory: string;
  basePath: string;
  baseFilename: string;
  baseDirectory: string;
  seedingTime: string;
  dateAdded: string;
  dateCreated: string;
  throttleName: string;
  isMultiFile: boolean;
  isPrivate: boolean
  tags: string[];
  comment: string;
  ignoreScheduler: boolean,
  trackerURIs: string[];
  seedsConnected: number;
  seedsTotal: number;
  peersTotal: number;
  status: string[];
  percentComplete: number;
  eta: number;
}

export interface TorrentListChangedPayload {
  action: 'TORRENT_LIST_ACTION_TORRENT_ADDED' | 'TORRENT_LIST_ACTION_TORRENT_DELETED' | 'TORRENT_LIST_ACTION_TORRENT_DETAIL_UPDATED';
  data: Partial<TorrentItem>;
}

export interface ClientFeedOpts {
  host: string;
  port: number;
}

export class ClientFeed extends EventEmitter {
  private torrentService: any;
  private opts: ClientFeedOpts;
  constructor(opts: ClientFeedOpts) {
    super();
    this.opts = opts;
    this.torrentService = new TorrentService(opts);
  }
  on (event: 'torrentListChanged', callback: (payload: TorrentListChangedPayload) => void): this;
  on (event: string, callback: (payload: any) => void): this {
    super.on(event, callback);
    return this;
  }
  private registerListeners() {
    this.torrentService.on(
      torrentServiceEvents.TORRENT_LIST_DIFF_CHANGE,
      (payload: any) => {
        const {diff, id} = payload;
  
        this.emit('torrentListChanged', diff);
        this.emit(`torrentChanged_${diff.data.hash}`, diff);
      }
    );
  }
  
  getInitialFeed () {
    const torrentList = this.torrentService.getTorrentList() as {
      torrents: TorrentItem[],
      length: number,
      id: number
    };
    this.registerListeners();
    return torrentList;
  }
}

