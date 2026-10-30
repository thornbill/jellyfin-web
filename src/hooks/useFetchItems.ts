import type { AxiosRequestConfig } from 'axios';
import type { LibraryApiGetItemsRequest } from '@jellyfin/sdk/lib/generated-client/api/library-api';
import type { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import { ImageType } from '@jellyfin/sdk/lib/generated-client/models/image-type';
import { ItemFields } from '@jellyfin/sdk/lib/generated-client/models/item-fields';
import { ItemSortBy } from '@jellyfin/sdk/lib/generated-client/models/item-sort-by';
import { getFilterApi } from '@jellyfin/sdk/lib/utils/api/filter-api';
import { getStudioApi } from '@jellyfin/sdk/lib/utils/api/studio-api';
import { getLibraryApi } from '@jellyfin/sdk/lib/utils/api/library-api';
import { useQuery } from '@tanstack/react-query';

import { type JellyfinApiContext, useApi } from './useApi';

import type { ParentId } from 'types/library';
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
