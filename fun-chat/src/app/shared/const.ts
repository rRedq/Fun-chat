import { AppEvents } from '@alltypes/emit-events';
import { EventEmitter } from './event-emitter';

const serverUrl = 'ws://localhost:4000' as const;

const rssUrl = 'https://rollingscopes.com/' as const;

const gitUrl = 'https://github.com/rredq' as const;

const storageKey = 'redq-authentication' as const;

const socketEmitter = new EventEmitter<AppEvents>();

const timeToApearModal = 10;

const timeToDisappearModal = 300;

export { serverUrl, rssUrl, gitUrl, storageKey, socketEmitter, timeToApearModal, timeToDisappearModal };
