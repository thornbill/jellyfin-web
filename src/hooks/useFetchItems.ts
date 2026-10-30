import type { AxiosRequestConfig } from 'axios';
import type { LibraryApiGetItemsRequest } from '@jellyfin/sdk/lib/generated-client/api/library-api';
import type { PlaylistApiMoveItemRequest } from '@jellyfin/sdk/lib/generated-client/api/playlist-api';
import type { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import { ImageType } from '@jellyfin/sdk/lib/generated-client/models/image-type';
import { ItemFields } from '@jellyfin/sdk/lib/generated-client/models/item-fields';
import { ItemFilter } from '@jellyfin/sdk/lib/generated-client/models/item-filter';
import { PersonKind } from '@jellyfin/sdk/lib/generated-client/models/person-kind';
import { ItemSortBy } from '@jellyfin/sdk/lib/generated-client/models/item-sort-by';
import { SortOrder } from '@jellyfin/sdk/lib/generated-client/models/sort-order';
import { getFilterApi } from '@jellyfin/sdk/lib/utils/api/filter-api';
import { getPersonApi } from '@jellyfin/sdk/lib/utils/api/person-api';
import { getStudioApi } from '@jellyfin/sdk/lib/utils/api/studio-api';
import { getPlaylistApi } from '@jellyfin/sdk/lib/utils/api/playlist-api';
import { getLibraryApi } from '@jellyfin/sdk/lib/utils/api/library-api';
import { getLiveTvApi } from '@jellyfin/sdk/lib/utils/api/live-tv-api';
import { useMutation, useQuery } from '@tanstack/react-query';

import { type JellyfinApiContext, useApi } from './useApi';
import { getAlphaPickerQuery, getFieldsQuery, getFiltersQuery, getLimitQuery } from 'utils/items';

import type { LibraryViewSettings, ParentId } from 'types/library';
import { LibraryTab } from 'types/libraryTab';
import type { ItemDtoQueryResult } from 'types/base/models/item-dto-query-result';

const fetchGetItems = async (
    currentApi: JellyfinApiContext,
    parametersOptions: LibraryApiGetItemsRequest,
    options?: AxiosRequestConfig
) => {
    const { api, user } = currentApi;
    if (api && user?.Id) {
        const response = await getLibraryApi(api).getItems(
            {
                userId: user.Id,
                ...parametersOptions
            },
            {
                signal: options?.signal
            }
        );
        return response.data as ItemDtoQueryResult;
    }
};

export const useGetItems = (parametersOptions: LibraryApiGetItemsRequest) => {
    const currentApi = useApi();
    const isRandom = Boolean(parametersOptions.sortBy?.includes(ItemSortBy.Random));

    return useQuery({
        queryKey: [
            'Items',
            {
                ...parametersOptions
            }
        ],
        queryFn: ({ signal }) =>
            fetchGetItems(currentApi, parametersOptions, { signal }),
        gcTime: isRandom ? Infinity : undefined,
        refetchOnMount: isRandom ? false : undefined,
        refetchOnWindowFocus: isRandom ? false : undefined,
        enabled: !!currentApi.api && !!currentApi.user?.Id
    });
};

const fetchGetStudios = async (
    currentApi: JellyfinApiContext,
    parentId: ParentId,
    itemType: BaseItemKind[],
    options?: AxiosRequestConfig
) => {
    const { api, user } = currentApi;
    if (api && user?.Id) {
        const response = await getStudioApi(api).getStudios(
            {
                userId: user.Id,
                includeItemTypes: itemType,
                fields: [
                    ItemFields.DateCreated,
                    ItemFields.PrimaryImageAspectRatio
                ],
                enableImageTypes: [ImageType.Thumb],
                parentId: parentId ?? undefined,
                enableTotalRecordCount: false
            },
            {
                signal: options?.signal
            }
        );
        return response.data.Items;
    }
};

export const useGetStudios = (parentId: ParentId, itemType: BaseItemKind[]) => {
    const currentApi = useApi();
    const isLivetv = parentId === 'livetv';
    return useQuery({
        queryKey: ['Studios', parentId, itemType],
        queryFn: ({ signal }) =>
            fetchGetStudios(currentApi, parentId, itemType, { signal }),
        enabled: !!currentApi.api && !!currentApi.user?.Id && !!parentId && !isLivetv
    });
};

const fetchGetQueryFiltersLegacy = async (
    currentApi: JellyfinApiContext,
    parentId: ParentId,
    itemType: BaseItemKind[],
    options?: AxiosRequestConfig
) => {
    const { api, user } = currentApi;
    if (api && user?.Id) {
        const response = await getFilterApi(api).getQueryFiltersLegacy(
            {
                userId: user.Id,
                parentId: parentId ?? undefined,
                includeItemTypes: itemType
            },
            {
                signal: options?.signal
            }
        );
        return response.data;
    }
};

const fetchGetQueryFilters = async (
    currentApi: JellyfinApiContext,
    parentId: ParentId,
    itemType: BaseItemKind[],
    options?: AxiosRequestConfig
) => {
    const { api, user } = currentApi;
    if (api && user?.Id) {
        const response = await getFilterApi(api).getQueryFilters(
            {
                userId: user.Id,
                parentId: parentId ?? undefined,
                includeItemTypes: itemType
            },
            {
                signal: options?.signal
            }
        );
        return response.data;
    }
};

export const useGetQueryFiltersLegacy = (
    parentId: ParentId,
    itemType: BaseItemKind[]
) => {
    const currentApi = useApi();
    const isLivetv = parentId === 'livetv';
    return useQuery({
        queryKey: ['QueryFiltersLegacy', parentId, itemType],
        queryFn: ({ signal }) =>
            fetchGetQueryFiltersLegacy(currentApi, parentId, itemType, {
                signal
            }),
        enabled: !!currentApi.api && !!currentApi.user?.Id && !!parentId && !isLivetv
    });
};

export const useGetQueryFilters = (
    parentId: ParentId,
    itemType: BaseItemKind[]
) => {
    const currentApi = useApi();
    const isLivetv = parentId === 'livetv';
    return useQuery({
        queryKey: ['QueryFilters', parentId, itemType],
        queryFn: ({ signal }) =>
            fetchGetQueryFilters(currentApi, parentId, itemType, {
                signal
            }),
        enabled: !!currentApi.api && !!currentApi.user?.Id && !!parentId && !isLivetv
    });
};

const fetchGetItemsViewByType = async (
    currentApi: JellyfinApiContext,
    viewType: LibraryTab | undefined,
    parentId: ParentId,
    itemType: BaseItemKind[],
    libraryViewSettings: LibraryViewSettings,
    options?: AxiosRequestConfig
) => {
    const { api, user } = currentApi;
    if (api && user?.Id && viewType) {
        const isFavorite = libraryViewSettings.Filters?.Status?.includes(ItemFilter.IsFavorite) || undefined;
        let response;
        switch (viewType) {
            case LibraryTab.AlbumArtists: {
                response = await getPersonApi(api).getPersons(
                    {
                        userId: user.Id,
                        parentId: parentId ?? undefined,
                        enableImageTypes: [libraryViewSettings.ImageType, ImageType.Backdrop],
                        ...getFieldsQuery(viewType, libraryViewSettings),
                        ...getFiltersQuery(viewType, libraryViewSettings),
                        ...getLimitQuery(),
                        ...getAlphaPickerQuery(libraryViewSettings),
                        personTypes: [PersonKind.AlbumArtist],
                        startIndex: libraryViewSettings.StartIndex
                    },
                    {
                        signal: options?.signal
                    }
                );
                break;
            }
            case LibraryTab.Artists: {
                response = await getPersonApi(api).getPersons(
                    {
                        userId: user.Id,
                        parentId: parentId ?? undefined,
                        enableImageTypes: [libraryViewSettings.ImageType, ImageType.Backdrop],
                        ...getFieldsQuery(viewType, libraryViewSettings),
                        ...getFiltersQuery(viewType, libraryViewSettings),
                        ...getLimitQuery(),
                        ...getAlphaPickerQuery(libraryViewSettings),
                        personTypes: [PersonKind.Artist],
                        startIndex: libraryViewSettings.StartIndex
                    },
                    {
                        signal: options?.signal
                    }
                );
                break;
            }
            case LibraryTab.Authors: {
                response = await getPersonApi(api).getPersons(
                    {
                        userId: user.Id,
                        parentId: parentId ?? undefined,
                        enableImageTypes: [libraryViewSettings.ImageType, ImageType.Backdrop],
                        fields: [ItemFields.PrimaryImageAspectRatio],
                        filters: libraryViewSettings?.Filters?.Status,
                        ...getLimitQuery(),
                        ...getAlphaPickerQuery(libraryViewSettings),
                        personTypes: [PersonKind.Author],
                        startIndex: libraryViewSettings.StartIndex
                    },
                    {
                        signal: options?.signal
                    }
                );
                break;
            }
            case LibraryTab.Studios:
                response = await getStudioApi(api).getStudios(
                    {
                        userId: user.Id,
                        parentId: parentId ?? undefined,
                        ...getFieldsQuery(viewType, libraryViewSettings),
                        ...getLimitQuery(),
                        ...getAlphaPickerQuery(libraryViewSettings),
                        includeItemTypes: itemType,
                        isFavorite,
                        enableImageTypes: [ImageType.Thumb],
                        startIndex: libraryViewSettings.StartIndex
                    },
                    {
                        signal: options?.signal
                    }
                );
                break;
            case LibraryTab.Channels: {
                response = await getLiveTvApi(api).getLiveTvChannels(
                    {
                        userId: user.Id,
                        fields: [ItemFields.PrimaryImageAspectRatio],
                        startIndex: libraryViewSettings.StartIndex,
                        isFavorite,
                        enableImageTypes: [ImageType.Primary]
                    },
                    {
                        signal: options?.signal
                    }
                );
                break;
            }
            case LibraryTab.Folders: {
                response = await getLibraryApi(api).getItems(
                    {
                        userId: user.Id,
                        recursive: false,
                        imageTypeLimit: 1,
                        parentId: parentId ?? undefined,
                        enableImageTypes: [libraryViewSettings.ImageType, ImageType.Backdrop],
                        ...getFieldsQuery(viewType, libraryViewSettings),
                        ...getFiltersQuery(viewType, libraryViewSettings),
                        ...getLimitQuery(),
                        ...getAlphaPickerQuery(libraryViewSettings),
                        sortBy: libraryViewSettings.SortBy,
                        sortOrder: [libraryViewSettings.SortOrder],
                        includeItemTypes: itemType,
                        startIndex: libraryViewSettings.StartIndex
                    },
                    {
                        signal: options?.signal
                    }
                );
                break;
            }
            case LibraryTab.SeriesTimers:
                response = await getLiveTvApi(api).getSeriesTimers(
                    {
                        sortBy: 'SortName',
                        sortOrder: SortOrder.Ascending
                    },
                    {
                        signal: options?.signal
                    }
                );
                break;
            default: {
                response = await getLibraryApi(api).getItems(
                    {
                        userId: user.Id,
                        recursive: true,
                        imageTypeLimit: 1,
                        parentId: parentId ?? undefined,
                        enableImageTypes: [libraryViewSettings.ImageType, ImageType.Backdrop],
                        ...getFieldsQuery(viewType, libraryViewSettings),
                        ...getFiltersQuery(viewType, libraryViewSettings),
                        ...getLimitQuery(),
                        ...getAlphaPickerQuery(libraryViewSettings),
                        isFavorite: viewType === LibraryTab.Favorites ? true : undefined,
                        sortBy: libraryViewSettings.SortBy,
                        sortOrder: [libraryViewSettings.SortOrder],
                        includeItemTypes: itemType,
                        startIndex: libraryViewSettings.StartIndex
                    },
                    {
                        signal: options?.signal
                    }
                );
                break;
            }
        }
        return response.data as ItemDtoQueryResult;
    }

    return {};
};

export const useGetItemsViewByType = (
    viewType: LibraryTab | undefined,
    parentId: ParentId,
    itemType: BaseItemKind[] = [],
    libraryViewSettings: LibraryViewSettings
) => {
    const currentApi = useApi();
    return useQuery({
        queryKey: [
            'User',
            currentApi.user?.Id,
            'Items',
            parentId,
            'ViewByType',
            viewType,
            {
                itemType,
                libraryViewSettings
            }
        ],
        queryFn: ({ signal }) =>
            fetchGetItemsViewByType(
                currentApi,
                viewType,
                parentId,
                itemType,
                libraryViewSettings!,
                { signal }
            ),
        refetchOnWindowFocus: false,
        enabled: !!currentApi.api && !!currentApi.user?.Id
            && viewType
            && [
                LibraryTab.Movies,
                LibraryTab.Favorites,
                LibraryTab.Collections,
                LibraryTab.Series,
                LibraryTab.Episodes,
                LibraryTab.Studios,
                LibraryTab.Albums,
                LibraryTab.AlbumArtists,
                LibraryTab.Artists,
                LibraryTab.Authors,
                LibraryTab.Playlists,
                LibraryTab.Songs,
                LibraryTab.Books,
                LibraryTab.PhotoAlbums,
                LibraryTab.Photos,
                LibraryTab.Videos,
                LibraryTab.Channels,
                LibraryTab.SeriesTimers,
                LibraryTab.MusicVideos,
                LibraryTab.Folders,
                LibraryTab.Mixed
            ].includes(viewType)
    });
};

const fetchPlaylistsMoveItem = async (
    currentApi: JellyfinApiContext,
    requestParameters: PlaylistApiMoveItemRequest
) => {
    const { api, user } = currentApi;
    if (api && user?.Id) {
        const response = await getPlaylistApi(api).moveItem({
            ...requestParameters
        });
        return response.data;
    }
};

export const usePlaylistsMoveItemMutation = () => {
    const currentApi = useApi();
    return useMutation({
        mutationFn: (requestParameters: PlaylistApiMoveItemRequest) =>
            fetchPlaylistsMoveItem(currentApi, requestParameters )
    });
};
