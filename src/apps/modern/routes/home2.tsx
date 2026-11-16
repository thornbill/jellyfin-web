import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import { CollectionType } from '@jellyfin/sdk/lib/generated-client/models/collection-type';
import { MediaType } from '@jellyfin/sdk/lib/generated-client/models/media-type';
import React, { useMemo } from 'react';

import HomeSection, { type HomeSectionDetails } from 'apps/modern/features/home/components/HomeSection';
import { EXCLUDED_TYPES } from 'apps/modern/features/home/components/RecentlyAddedSection';
import { HomeSectionType } from 'constants/homeSectionType';
import Page from 'components/Page';
import { useUserViews } from 'hooks/api/useUserViews';
import { useUserSettings } from 'hooks/useUserSettings';
import { useApi } from 'hooks/useApi';

export const Component = () => {
    const { homeSections } = useUserSettings();
    const { user } = useApi();
    const { data: userViewsResponse } = useUserViews();

    const recentlyAddedViews = useMemo(() => {
        const userExcludes = user?.Configuration?.LatestItemsExcludes ?? [];
        const userViews = userViewsResponse?.Items ?? [];
        return userViews
            .filter(view => (
                // Exclude unsupported collection types
                // NOTE: "Mixed" libraries will not have a collection type, but we still include them
                (!EXCLUDED_TYPES.includes(view.CollectionType || CollectionType.Movies))
                // Exclude user-excluded views
                && (view.Id && !userExcludes.includes(view.Id))
            ));
    }, [ user, userViewsResponse ]);

    const sections = useMemo(() => {
        const _sections: HomeSectionDetails[] = [];
        for (const sectionType of homeSections) {
            if (sectionType === HomeSectionType.ResumeAudio) {
                _sections.push({ sectionType: HomeSectionType.Resume, mediaType: MediaType.Audio });
            } else if (sectionType === HomeSectionType.ResumeBook) {
                _sections.push({ sectionType: HomeSectionType.Resume, mediaType: MediaType.Book });
            } else if (sectionType === HomeSectionType.LatestMedia) {
                recentlyAddedViews.forEach(view => {
                    _sections.push({ sectionType, baseItem: view });
                });
            } else {
                _sections.push({ sectionType });
            }
        }
        return _sections;
    }, [ homeSections, recentlyAddedViews ]);

    return (
        <Page
            id='indexPage'
            className='mainAnimatedPage homePage libraryPage allLibraryPage backdropPage'
            isBackButtonEnabled={false}
            backDropType={[
                BaseItemKind.Movie,
                BaseItemKind.Series,
                BaseItemKind.Book
            ]}
        >
            {sections.map(section => (
                <HomeSection
                    // NOTE: Sections can be duplicated on the home screen so this is not truly unique
                    key={section.sectionType + (section.mediaType || '') + (section.baseItem?.Id || '')}
                    section={section}
                />
            ))}
        </Page>
    );
};

Component.displayName = 'Home2';
