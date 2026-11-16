import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models/base-item-dto';
import { MediaType } from '@jellyfin/sdk/lib/generated-client/models/media-type';
import Typography from '@mui/material/Typography';
import React, { lazy, type FC } from 'react';

import { HomeSectionType } from 'constants/homeSectionType';
import globalize from 'lib/globalize';
import LazyComponent from 'components/LazyComponent';
import { SectionVariant } from './MyMediaSection';

const ResumeSection = lazy(() => import( './ResumeSection'));
const RecentlyAddedSection = lazy(() => import('./RecentlyAddedSection'));
const NextUpSection = lazy(() => import('./NextUpSection'));
const MyMediaSection = lazy(() => import('./MyMediaSection'));

export interface HomeSectionDetails {
    sectionType: HomeSectionType;
    mediaType?: MediaType;
    baseItem?: BaseItemDto;
}

const getSectionTitle = ({ sectionType, mediaType, baseItem }: HomeSectionDetails) => {
    switch (sectionType) {
        case HomeSectionType.LatestMedia:
            return ['LatestFromLibrary', baseItem?.Name || ''];
        case HomeSectionType.NextUp:
            return ['NextUp'];
        case HomeSectionType.Resume:
            switch (mediaType) {
                case MediaType.Audio:
                    return ['HeaderContinueListening'];
                case MediaType.Book:
                    return ['HeaderContinueReading'];
                default:
                    return ['HeaderContinueWatching'];
            }
        case HomeSectionType.LibraryButtons:
        case HomeSectionType.SmallLibraryTiles:
            return ['HeaderMyMedia'];
    }

    return [];
};

const SectionSkeleton: FC<{ section: HomeSectionDetails }> = ({
    section
}) => (
    <div
        className='padded-left padded-right'
        // Set a min height to prevent layout shift when the section loads.
        // This is currently based on the measured height of a section container, but should be refined to be more accurate.
        style={{ minHeight: '270px' }}
    >
        <Typography
            variant='h2'
            sx={{ padding: '6px 8px' }}
        >
            {globalize.translate(...getSectionTitle(section))}
        </Typography>
    </div>
);

const HomeSection: FC<{ section: HomeSectionDetails }> = ({
    section
}) => {
    const { sectionType, mediaType, baseItem } = section;

    switch (sectionType) {
        // FIXME: Still need to implement live tv sections
        case HomeSectionType.LatestMedia:
            return (
                <LazyComponent skeleton={<SectionSkeleton section={section} />}>
                    <RecentlyAddedSection view={baseItem!} />
                </LazyComponent>
            );
        case HomeSectionType.LibraryButtons:
            return (
                <LazyComponent skeleton={<SectionSkeleton section={section} />}>
                    <MyMediaSection variant={SectionVariant.Buttons} />
                </LazyComponent>
            );
        case HomeSectionType.NextUp:
            return (
                <LazyComponent skeleton={<SectionSkeleton section={section} />}>
                    <NextUpSection />
                </LazyComponent>
            );
        case HomeSectionType.Resume:
            return (
                <LazyComponent skeleton={<SectionSkeleton section={section} />}>
                    <ResumeSection mediaType={mediaType || MediaType.Video} />
                </LazyComponent>
            );
        case HomeSectionType.SmallLibraryTiles:
            return (
                <LazyComponent skeleton={<SectionSkeleton section={section} />}>
                    <MyMediaSection />
                </LazyComponent>
            );
    }
    return undefined;
};

export default HomeSection;
