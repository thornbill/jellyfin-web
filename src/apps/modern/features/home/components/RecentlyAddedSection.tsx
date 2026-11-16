import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models/base-item-dto';
import { CollectionType } from '@jellyfin/sdk/lib/generated-client/models/collection-type';
import { ImageType } from '@jellyfin/sdk/lib/generated-client/models/image-type';
import { ItemFields } from '@jellyfin/sdk/lib/generated-client/models/item-fields';
import React, { FC } from 'react';

import { useLatestMedia } from 'apps/legacy/features/libraries/api/useLatestMedia';
import { CardShape } from 'components/cardbuilder/utils/shape';
import SectionContainer from 'components/common/SectionContainer';
import { appRouter } from 'components/router/appRouter';
import globalize from 'lib/globalize';

/** Collection types that should not prefer thumb images */
const CARD_NOT_THUMB_TYPES: CollectionType[] = [
    CollectionType.Movies,
    CollectionType.Tvshows,
    CollectionType.Music
];

/** Collection types that show parent title on cards */
const CARD_PARENT_TITLE_TYPES: CollectionType[] = [
    CollectionType.Music,
    CollectionType.Tvshows
];

/** Collection types that show years on cards */
const CARD_YEAR_TYPES: CollectionType[] = [
    CollectionType.Movies,
    CollectionType.Tvshows
];

/** Collection types that are excluded from displaying latest items */
export const EXCLUDED_TYPES: CollectionType[] = [
    CollectionType.Boxsets,
    CollectionType.Folders,
    CollectionType.Livetv,
    CollectionType.Playlists,
    CollectionType.Unknown
];

const getCardShape = (collectionType: CollectionType | undefined) => {
    switch (collectionType) {
        case CollectionType.Books:
        case CollectionType.Movies:
        case CollectionType.Tvshows:
            return CardShape.PortraitOverflow;
        case CollectionType.Homevideos:
        case CollectionType.Music:
            return CardShape.SquareOverflow;
        default:
            return CardShape.BackdropOverflow;
    }
};

interface RecentlyAddedSectionProps {
    view: BaseItemDto;
}

/** The "Recently Added" section for a specific library. */
export const RecentlyAddedSection: FC<RecentlyAddedSectionProps> = ({
    view
}) => {
    const { data: items } = useLatestMedia({
        limit: view.CollectionType === CollectionType.Music ? 30 : 16,
        fields: [
            ItemFields.PrimaryImageAspectRatio,
            ItemFields.Path
        ],
        imageTypeLimit: 1,
        enableImageTypes: [
            ImageType.Primary,
            ImageType.Backdrop,
            ImageType.Thumb
        ],
        parentId: view.Id
    });

    const cardOptions = {
        shape: getCardShape(view.CollectionType),
        preferThumb: !view.CollectionType || !CARD_NOT_THUMB_TYPES.includes(view.CollectionType) ? 'auto' : null,
        showUnplayedIndicator: false,
        showChildCountIndicator: true,
        context: 'home',
        overlayText: false,
        centerText: true,
        overlayPlayButton: view.CollectionType !== CollectionType.Photos,
        allowBottomPadding: false,
        cardLayout: false,
        showTitle: view.CollectionType !== CollectionType.Photos,
        showYear: !view.CollectionType || CARD_YEAR_TYPES.includes(view.CollectionType),
        showParentTitle: !view.CollectionType || CARD_PARENT_TITLE_TYPES.includes(view.CollectionType),
        lazy: true,
        lines: 2
    };

    if (!items?.length) {
        return null;
    }

    return (
        <SectionContainer
            title={globalize.translate('LatestFromLibrary', view.Name || '')}
            url={appRouter.getRouteUrl(view, { section: 'latest' }).substring(1)}
            items={items}
            cardOptions={cardOptions}
        />
    );
};

export default RecentlyAddedSection;
