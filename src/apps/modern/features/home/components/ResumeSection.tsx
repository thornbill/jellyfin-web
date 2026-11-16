import { ImageType } from '@jellyfin/sdk/lib/generated-client/models/image-type';
import { ItemFields } from '@jellyfin/sdk/lib/generated-client/models/item-fields';
import { MediaType } from '@jellyfin/sdk/lib/generated-client/models/media-type';
import React, { FC } from 'react';

import { useResumeItems } from 'apps/legacy/features/libraries/api/useResumeItems';
import { CardShape } from 'components/cardbuilder/utils/shape';
import SectionContainer from 'components/common/SectionContainer';
import globalize from 'lib/globalize';
import { useUserSettings } from 'hooks/useUserSettings';

const getSectionTitle = (mediaType: MediaType) => {
    switch (mediaType) {
        case MediaType.Audio:
            return 'HeaderContinueListening';
        case MediaType.Book:
            return 'HeaderContinueReading';
        default:
            return 'HeaderContinueWatching';
    }
};

interface ResumeSectionProps {
    mediaType: MediaType;
}

const ResumeSection: FC<ResumeSectionProps> = ({
    mediaType
}) => {
    const { useEpisodeImagesInNextUpAndResume: useEpisodeImages } = useUserSettings();
    const {
        data: itemsResponse
    } = useResumeItems({
        limit: 12,
        fields: [ ItemFields.PrimaryImageAspectRatio ],
        imageTypeLimit: 1,
        enableImageTypes: [
            ImageType.Primary,
            ImageType.Backdrop,
            ImageType.Thumb
        ],
        enableTotalRecordCount: false,
        mediaTypes: [ mediaType ]
    });
    const items = itemsResponse?.Items ?? [];

    if (!items.length) {
        return null;
    }

    return (
        <SectionContainer
            title={globalize.translate(getSectionTitle(mediaType))}
            items={items}
            cardOptions={{
                preferThumb: true,
                inheritThumb: !useEpisodeImages,
                shape: (mediaType === MediaType.Book) ?
                    CardShape.PortraitOverflow :
                    CardShape.BackdropOverflow,
                overlayText: false,
                showTitle: true,
                showParentTitle: true,
                lazy: true,
                showDetailsMenu: true,
                overlayPlayButton: true,
                context: 'home',
                centerText: true,
                allowBottomPadding: false,
                cardLayout: false,
                showYear: true,
                lines: 2
            }}
        />
    );
};

export default ResumeSection;
