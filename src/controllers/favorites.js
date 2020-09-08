import { appRouter } from '../components/appRouter';
import cardBuilder from '../components/cardbuilder/cardBuilder';
import dom from '../scripts/dom';
import globalize from '../scripts/globalize';
import { ConnectionManager } from 'jellyfin-apiclient';
import { appHost } from '../components/apphost';
import layoutManager from '../components/layoutManager';
import focusManager from '../components/focusManager';
import '../elements/emby-itemscontainer/emby-itemscontainer';
import '../elements/emby-scroller/emby-scroller';

/* eslint-disable indent */

    function enableScrollX() {
        return true;
    }

    function getThumbShape() {
        return enableScrollX() ? 'overflowBackdrop' : 'backdrop';
    }

    function getPosterShape() {
        return enableScrollX() ? 'overflowPortrait' : 'portrait';
    }

    function getSquareShape() {
        return enableScrollX() ? 'overflowSquare' : 'square';
    }

    function getSections() {
        return [{
            name: 'HeaderFavoriteMovies',
            types: 'Movie',
            shape: getPosterShape(),
            showTitle: true,
            showYear: true,
            overlayPlayButton: true,
            overlayText: false,
            centerText: true
        }, {
            name: 'HeaderFavoriteShows',
            types: 'Series',
            shape: getPosterShape(),
            showTitle: true,
            showYear: true,
            overlayPlayButton: true,
            overlayText: false,
            centerText: true
        }, {
            name: 'HeaderFavoriteEpisodes',
            types: 'Episode',
            shape: getThumbShape(),
            preferThumb: false,
            showTitle: true,
            showParentTitle: true,
            overlayPlayButton: true,
            overlayText: false,
            centerText: true
        }, {
            name: 'HeaderFavoriteVideos',
            types: 'Video',
            shape: getThumbShape(),
            preferThumb: true,
            showTitle: true,
            overlayPlayButton: true,
            overlayText: false,
            centerText: true
        }, {
            name: 'HeaderFavoriteCollections',
            types: 'BoxSet',
            shape: getPosterShape(),
            showTitle: true,
            overlayPlayButton: true,
            overlayText: false,
            centerText: true
        }, {
            name: 'HeaderFavoritePlaylists',
            types: 'Playlist',
            shape: getSquareShape(),
            preferThumb: false,
            showTitle: true,
            overlayText: false,
            showParentTitle: false,
            centerText: true,
            overlayPlayButton: true,
            coverImage: true
        }, {
            name: 'HeaderFavoritePeople',
            types: 'Person',
            shape: getPosterShape(),
            preferThumb: false,
            showTitle: true,
            overlayText: false,
            showParentTitle: false,
            centerText: true,
            overlayPlayButton: true,
            coverImage: true
        }, {
            name: 'HeaderFavoriteArtists',
            types: 'MusicArtist',
            shape: getSquareShape(),
            preferThumb: false,
            showTitle: true,
            overlayText: false,
            showParentTitle: false,
            centerText: true,
            overlayPlayButton: true,
            coverImage: true
        }, {
            name: 'HeaderFavoriteAlbums',
            types: 'MusicAlbum',
            shape: getSquareShape(),
            preferThumb: false,
            showTitle: true,
            overlayText: false,
            showParentTitle: true,
            centerText: true,
            overlayPlayButton: true,
            coverImage: true
        }, {
            name: 'HeaderFavoriteSongs',
            types: 'Audio',
            shape: getSquareShape(),
            preferThumb: false,
            showTitle: true,
            overlayText: false,
            showParentTitle: true,
            centerText: true,
            overlayMoreButton: true,
            action: 'instantmix',
            coverImage: true
        }, {
            name: 'HeaderFavoriteBooks',
            types: 'Book',
            shape: getPosterShape(),
            showTitle: true,
            showYear: true,
            overlayPlayButton: true,
            overlayText: false,
            centerText: true
        }];
    }

    function getFetchDataFn(section) {
        return function () {
            const apiClient = this.apiClient;
            const options = {
                SortBy: (section.types, 'SeriesName,SortName'),
                SortOrder: 'Ascending',
                Filters: 'IsFavorite',
                Recursive: true,
                Fields: 'PrimaryImageAspectRatio,BasicSyncInfo',
                CollapseBoxSetItems: false,
                ExcludeLocationTypes: 'Virtual',
                EnableTotalRecordCount: false
            };
            options.Limit = 20;
            const userId = apiClient.getCurrentUserId();

            if (section.types === 'MusicArtist') {
                return apiClient.getArtists(userId, options);
            }

            if (section.types === 'Person') {
                return apiClient.getPeople(userId, options);
            }

            options.IncludeItemTypes = section.types;
            return apiClient.getItems(userId, options);
        };
    }

    function getRouteUrl(section, serverId) {
        return appRouter.getRouteUrl('list', {
            serverId: serverId,
            itemTypes: section.types,
            isFavorite: true
        });
    }

    function getItemsHtmlFn(section) {
        return function (items) {
            let cardLayout = appHost.preferVisualCards && section.autoCardLayout && section.showTitle;
            cardLayout = false;
            const serverId = this.apiClient.serverId();
            const leadingButtons = layoutManager.tv ? [{
                name: globalize.translate('All'),
                id: 'more',
                icon: 'favorite',
                routeUrl: getRouteUrl(section, serverId)
            }] : null;
            let lines = 0;

            if (section.showTitle) {
                lines++;
            }

            if (section.showYear) {
                lines++;
            }

            if (section.showParentTitle) {
                lines++;
            }

            return cardBuilder.getCardsHtml({
                items: items,
                preferThumb: section.preferThumb,
                shape: section.shape,
                centerText: section.centerText && !cardLayout,
                overlayText: section.overlayText !== false,
                showTitle: section.showTitle,
                showYear: section.showYear,
                showParentTitle: section.showParentTitle,
                scalable: true,
                coverImage: section.coverImage,
                overlayPlayButton: section.overlayPlayButton,
                overlayMoreButton: section.overlayMoreButton && !cardLayout,
                action: section.action,
                allowBottomPadding: !enableScrollX(),
                cardLayout: cardLayout,
                leadingButtons: leadingButtons,
                lines: lines
            });
        };
    }

    function createSections(instance, elem, apiClient) {
        const sections = getSections();
        let html = '';

        for (const section of sections) {
            let sectionClass = 'verticalSection';

            if (!section.showTitle) {
                sectionClass += ' verticalSection-extrabottompadding';
            }

            html += '<div class="' + sectionClass + ' hide">';
            html += '<div class="sectionTitleContainer sectionTitleContainer-cards padded-left">';

            if (layoutManager.tv) {
                html += '<h2 class="sectionTitle sectionTitle-cards">' + globalize.translate(section.name) + '</h2>';
            } else {
                html += '<a is="emby-linkbutton" href="' + getRouteUrl(section, apiClient.serverId()) + '" class="more button-flat button-flat-mini sectionTitleTextButton">';
                html += '<h2 class="sectionTitle sectionTitle-cards">';
                html += globalize.translate(section.name);
                html += '</h2>';
                html += '<span class="material-icons chevron_right"></span>';
                html += '</a>';
            }

            html += '</div>';
            html += '<div is="emby-scroller" class="padded-top-focusscale padded-bottom-focusscale" data-centerfocus="true"><div is="emby-itemscontainer" class="itemsContainer scrollSlider focuscontainer-x" data-monitor="markfavorite"></div></div>';
            html += '</div>';
        }

        elem.innerHTML = html;
        const elems = elem.querySelectorAll('.itemsContainer');

        for (let i = 0, length = elems.length; i < length; i++) {
            const itemsContainer = elems[i];
            itemsContainer.fetchData = getFetchDataFn(sections[i]).bind(instance);
            itemsContainer.getItemsHtml = getItemsHtmlFn(sections[i]).bind(instance);
            itemsContainer.parentContainer = dom.parentWithClass(itemsContainer, 'verticalSection');
        }
    }

class FavoritesTab {
    constructor(view, params) {
        this.view = view;
        this.params = params;
        this.apiClient = window.ConnectionManager.currentApiClient();
        this.sectionsContainer = view.querySelector('.sections');
        createSections(this, this.sectionsContainer, this.apiClient);
    }

    onResume(options) {
        const promises = (this.apiClient, []);
        const view = this.view;
        const elems = this.sectionsContainer.querySelectorAll('.itemsContainer');

        for (const elem of elems) {
            promises.push(elem.resume(options));
        }

        Promise.all(promises).then(function () {
            if (options.autoFocus) {
                focusManager.autoFocus(view);
            }
        });
    }

    onPause() {
        const elems = this.sectionsContainer.querySelectorAll('.itemsContainer');

        for (const elem of elems) {
            elem.pause();
        }
    }

    destroy() {
        this.view = null;
        this.params = null;
        this.apiClient = null;
        const elems = this.sectionsContainer.querySelectorAll('.itemsContainer');

        for (const elem of elems) {
            elem.fetchData = null;
            elem.getItemsHtml = null;
            elem.parentContainer = null;
        }

        this.sectionsContainer = null;
    }
}

export default FavoritesTab;

/* eslint-enable indent */
