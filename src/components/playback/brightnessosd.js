import { Events } from 'jellyfin-apiclient';
import { playbackManager } from './playbackmanager';
import dom from '../../scripts/dom';
import browser from '../../scripts/browser';
import './iconosd.css';
import 'material-design-icons-iconfont';

var currentPlayer;
var osdElement;
var iconElement;
var progressElement;

var enableAnimation;

function getOsdElementHtml() {
    var html = '';

    html += '<span class="material-icons iconOsdIcon brightness_high"></span>';

    html += '<div class="iconOsdProgressOuter"><div class="iconOsdProgressInner brightnessOsdProgressInner"></div></div>';

    return html;
}

function ensureOsdElement() {
    var elem = osdElement;
    if (!elem) {
        enableAnimation = browser.supportsCssAnimation();

        elem = document.createElement('div');
        elem.classList.add('hide');
        elem.classList.add('iconOsd');
        elem.classList.add('iconOsd-hidden');
        elem.classList.add('brightnessOsd');
        elem.innerHTML = getOsdElementHtml();

        iconElement = elem.querySelector('.material-icons');
        progressElement = elem.querySelector('.iconOsdProgressInner');

        document.body.appendChild(elem);
        osdElement = elem;
    }
}

function onHideComplete() {
    this.classList.add('hide');
}

var hideTimeout;
function showOsd() {
    clearHideTimeout();

    var elem = osdElement;

    dom.removeEventListener(elem, dom.whichTransitionEvent(), onHideComplete, {
        once: true
    });

    elem.classList.remove('hide');

    // trigger reflow
    void elem.offsetWidth;

    requestAnimationFrame(function () {
        elem.classList.remove('iconOsd-hidden');

        hideTimeout = setTimeout(hideOsd, 3000);
    });
}

function clearHideTimeout() {
    if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
    }
}

function hideOsd() {
    clearHideTimeout();

    var elem = osdElement;
    if (elem) {
        if (enableAnimation) {
            // trigger reflow
            void elem.offsetWidth;

            requestAnimationFrame(function () {
                elem.classList.add('iconOsd-hidden');

                dom.addEventListener(elem, dom.whichTransitionEvent(), onHideComplete, {
                    once: true
                });
            });
        } else {
            onHideComplete.call(elem);
        }
    }
}

function setIcon(iconElement, icon) {
    iconElement.classList.remove('brightness_high', 'brightness_medium', 'brightness_low');
    iconElement.classList.add(icon);
}

function updateElementsFromPlayer(brightness) {
    if (iconElement) {
        if (brightness >= 80) {
            setIcon(iconElement, 'brightness_high');
        } else if (brightness >= 20) {
            setIcon(iconElement, 'brightness_medium');
        } else {
            setIcon(iconElement, 'brightness_low');
        }
    }
    if (progressElement) {
        progressElement.style.width = (brightness || 0) + '%';
    }
}

function releaseCurrentPlayer() {
    var player = currentPlayer;

    if (player) {
        Events.off(player, 'brightnesschange', onBrightnessChanged);
        Events.off(player, 'playbackstop', hideOsd);
        currentPlayer = null;
    }
}

function onBrightnessChanged(e) {
    var player = this;

    ensureOsdElement();

    updateElementsFromPlayer(playbackManager.getBrightness(player));

    showOsd();
}

function bindToPlayer(player) {
    if (player === currentPlayer) {
        return;
    }

    releaseCurrentPlayer();

    currentPlayer = player;

    if (!player) {
        return;
    }

    hideOsd();
    Events.on(player, 'brightnesschange', onBrightnessChanged);
    Events.on(player, 'playbackstop', hideOsd);
}

Events.on(playbackManager, 'playerchange', function () {
    bindToPlayer(playbackManager.getCurrentPlayer());
});

bindToPlayer(playbackManager.getCurrentPlayer());
