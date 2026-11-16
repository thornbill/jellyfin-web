import { ImageType } from '@jellyfin/sdk/lib/generated-client/models/image-type';
import { ItemFields } from '@jellyfin/sdk/lib/generated-client/models/item-fields';
import React, { useMemo } from 'react';

import { useNextUp } from 'apps/legacy/features/libraries/api/useNextUp';
import { CardShape } from 'components/cardbuilder/utils/shape';
import SectionContainer from 'components/common/SectionContainer';
import { useApi } from '@/hooks/useApi';
import { useUserSettings } from 'hooks/useUserSettings';
import globalize from 'lib/globalize';
import { toIsoDateOnlyString } from 'utils/date';
import { appRouter } from 'components/router/appRouter';

const NextUpSection = () => {
    const { serverId } = useApi();

    const {
        enableRewatchingInNextUp,
        maxDaysForNextUp,
        useEpisodeImagesInNextUpAndResume
    } = useUserSettings();

    const oldestDateForNextUp = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() - maxDaysForNextUp);
        return date;
    }, [ maxDaysForNextUp ]);

    const { data } = useNextUp( {
        limit: 24,
        fields: [
            ItemFields.PrimaryImageAspectRatio,
            ItemFields.DateCreated,
            ItemFields.Path,
            ItemFields.MediaSourceCount
        ],
        imageTypeLimit: 1,
        enableImageTypes: [
            ImageType.Primary,
            ImageType.Backdrop,
            ImageType.Thumb
        ],
        enableTotalRecordCount: false,
        nextUpDateCutoff: toIsoDateOnlyString(oldestDateForNextUp),
        enableResumable: false,
        enableRewatching: enableRewatchingInNextUp
    });
    const nextUpItems = data?.Items || [];

    return (
        <SectionContainer
            title={globalize.translate('NextUp')}
            url={
                appRouter.getRouteUrl('nextup', { serverId }).substring(1) // remove leading slash
            }
            items={nextUpItems}
            cardOptions={{
                preferThumb: true,
                inheritThumb: !useEpisodeImagesInNextUpAndResume,
                shape: CardShape.BackdropOverflow,
                overlayText: false,
                showTitle: true,
                showParentTitle: true,
                lazy: true,
                overlayPlayButton: true,
                context: 'home',
                centerText: true,
                allowBottomPadding: false,
                cardLayout: false
            }}
        />
    );
};

export default NextUpSection;
