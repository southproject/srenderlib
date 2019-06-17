
import LRU from '../../../util/core/LRU';

var globalVideoCache = new LRU(50);

/**
 * @param {string|HTMLVideoElement|HTMLCanvasElement|Canvas} newVideoOrSrc
 * @return {HTMLVideoElement|HTMLCanvasElement|Canvas} video
 */
export function findExistVideo(newVideoOrSrc) {
    if (typeof newVideoOrSrc === 'string') {
        var cachedVideoObj = globalVideoCache.get(newVideoOrSrc);
        return cachedVideoObj && cachedVideoObj.video;
    }
    else {
        return newVideoOrSrc;
    }
}

/**
 * Caution: User should cache loaded videos, but not just count on LRU.
 * Consider if required videos more than LRU size, will dead loop occur?
 *
 * @param {string|HTMLVideoElement|HTMLCanvasElement|Canvas} newVideoOrSrc
 * @param {HTMLVideoElement|HTMLCanvasElement|Canvas} video Existent video.
 * @param {module:zrender/Element} [hostEl] For calling `dirty`.
 * @param {Function} [cb] params: (video, cbPayload)
 * @param {Object} [cbPayload] Payload on cb calling.
 * @return {HTMLVideoElement|HTMLCanvasElement|Canvas} video
 */
export function createOrUpdateVideo(newVideoOrSrc, video, hostEl, cb, cbPayload) {
    if (!newVideoOrSrc) {
        return video;
    }
    else if (typeof newVideoOrSrc === 'string') {

        // Video should not be loaded repeatly. && video.__zrVideoSrc === newVideoOrSrc
        if (video || !hostEl) {
            return video;
        }

        // Only when there is no existent video or existent video src
        // is different, this method is responsible for load.
        var cachedVideoObj = globalVideoCache.get(newVideoOrSrc);

        var pendingWrap = {hostEl: hostEl, cb: cb, cbPayload: cbPayload};

        if (cachedVideoObj) {
            video = cachedVideoObj.video;
            (!video) && cachedVideoObj.pending.push(pendingWrap);
        }
        else {
            !video && (video = document.createElement('Video'));
            video.onload = video.onerror = videoOnLoad;

            globalVideoCache.put(
                newVideoOrSrc,
                video.__cachedVideoObj = {
                    video: video,
                    pending: [pendingWrap]
                }
            );
            //video.autoplay='true';
            video.src = video.__zrVideoSrc = newVideoOrSrc;
        }
        return video;
    }
    // newVideoOrSrc is an HTMLVideoElement or HTMLCanvasElement or Canvas
    else {
        return newVideoOrSrc;
    }
}

function videoOnLoad() {
    var cachedVideoObj = this.__cachedVideoObj;
    this.onload = this.onerror = this.__cachedVideoObj = null;

    for (var i = 0; i < cachedVideoObj.pending.length; i++) {
        var pendingWrap = cachedVideoObj.pending[i];
        var cb = pendingWrap.cb;
        cb && cb(this, pendingWrap.cbPayload);
        pendingWrap.hostEl.dirty();
    }
    cachedVideoObj.pending.length = 0;
}

