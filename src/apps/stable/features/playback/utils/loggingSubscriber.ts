import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models/base-item-dto';
import type { MediaSourceInfo } from '@jellyfin/sdk/lib/generated-client/models/media-source-info';

import type { PlaybackManager } from 'components/playback/playbackmanager';
import type { MediaError } from 'types/mediaError';
import type { PlayTarget } from 'types/playTarget';
import type { PlaybackStopInfo, PlayerState } from 'types/playbackStopInfo';
import type { Plugin } from 'types/plugin';
import type { Event } from 'utils/events';

import { PlaybackSubscriber } from './playbackSubscriber';
import type { ManagedPlayerStopInfo, MovedItem, PlayerError, PlayerErrorCode, PlayerStopInfo, RemovedItems } from '../types/callbacks';

export const bindLoggingSubscriber = (playbackManager: PlaybackManager) => new LoggingSubscriber(playbackManager);

export class LoggingSubscriber extends PlaybackSubscriber {
    onPlaybackCancelled(e: Event) {
        console.debug('[LoggingSubscriber] onPlaybackCancelled', e);
    }

    onPlaybackError(e: Event, errorType: MediaError) {
        console.debug('[LoggingSubscriber] onPlaybackError', e, errorType);
    }

    onPlaybackStart(e: Event, player: Plugin, state: PlayerState) {
        console.debug('[LoggingSubscriber] onPlaybackStart', e, player, state);
    }

    onPlaybackStop(e: Event, info: PlaybackStopInfo) {
        console.debug('[LoggingSubscriber] onPlaybackStop', e, info);
    }

    onPlayerChange(e: Event, player: Plugin, target: PlayTarget, previousPlayer: Plugin) {
        console.debug('[LoggingSubscriber] onPlayerChange', e, player, target, previousPlayer);
    }

    onPlayerError(e: Event, error: PlayerError) {
        console.debug('[LoggingSubscriber] onPlayerError', e, error);
    }

    onPlayerFullscreenChange(e: Event) {
        console.debug('[LoggingSubscriber] onPlayerFullscreenChange', e);
    }

    onPlayerItemStarted(e: Event, item?: BaseItemDto | undefined, mediaSource?: MediaSourceInfo | undefined) {
        console.debug('[LoggingSubscriber] onPlayerItemStarted', e, item, mediaSource);
    }

    onPlayerItemStopped(e: Event, info: ManagedPlayerStopInfo) {
        console.debug('[LoggingSubscriber] onPlayerItemStopped', e, info);
    }

    onPlayerMediaStreamsChange(e: Event) {
        console.debug('[LoggingSubscriber] onPlayerMediaStreamsChange', e);
    }

    onPlayerPause(e: Event) {
        console.debug('[LoggingSubscriber] onPlayerPause', e);
    }

    onPlayerPlaybackStart(e: Event, state: PlayerState) {
        console.debug('[LoggingSubscriber] onPlayerPlaybackStart', e, state);
    }

    onPlayerPlaybackStop(e: Event, state: PlayerState) {
        console.debug('[LoggingSubscriber] onPlayerPlaybackStop', e, state);
    }

    onPlayerPlaylistItemAdd(e: Event) {
        console.debug('[LoggingSubscriber] onPlayerPlaylistItemAdd', e);
    }

    onPlayerPlaylistItemMove(e: Event, item: MovedItem) {
        console.debug('[LoggingSubscriber] onPlayerPlaylistItemMove', e, item);
    }

    onPlayerPlaylistItemRemove(e: Event, items?: RemovedItems | undefined) {
        console.debug('[LoggingSubscriber] onPlayerPlaylistItemRemove', e, items);
    }

    onPlayerRepeatModeChange(e: Event) {
        console.debug('[LoggingSubscriber] onPlayerRepeatModeChange', e);
    }

    onPlayerShuffleModeChange(e: Event) {
        console.debug('[LoggingSubscriber] onPlayerShuffleModeChange', e);
    }

    onPlayerStopped(e: Event, info?: PlayerErrorCode | PlayerStopInfo) {
        console.debug('[LoggingSubscriber] onPlayerStopped', e, info);
    }

    onPlayerTimeUpdate(e: Event) {
        console.debug('[LoggingSubscriber] onPlayerTimeUpdate', e);
    }

    onPlayerUnpause(e: Event) {
        console.debug('[LoggingSubscriber] onPlayerUnpause', e);
    }

    onPlayerVolumeChange(e: Event) {
        console.debug('[LoggingSubscriber] onPlayerVolumeChange', e);
    }

    onReportPlayback(e: Event, isServerItem: boolean) {
        console.debug('[LoggingSubscriber] onReportPlayback', e, isServerItem);
    }
}
