import React, { type FC } from 'react';

import { CardShape } from 'components/cardbuilder/utils/shape';
import SectionContainer from 'components/common/SectionContainer';
import { useUserViews } from 'hooks/api/useUserViews';
import globalize from 'lib/globalize';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { getLibraryIcon } from 'utils/image';
import Icon from '@mui/material/Icon';
import { appRouter } from 'components/router/appRouter';
import { Link } from 'react-router-dom';

export const enum SectionVariant {
    Default = 'default',
    Buttons = 'buttons'
}

interface MyMediaSectionProps {
    variant?: SectionVariant;
}

/** The "My Media" section of the home screen showing user libraries. */
const MyMediaSection: FC<MyMediaSectionProps> = ({
    variant = SectionVariant.Default
}) => {
    const { data } = useUserViews();
    const userViews = data?.Items || [];

    if (variant === SectionVariant.Buttons) {
        return (
            <Box>
                <Toolbar
                    variant='dense'
                    className='padded-left padded-right'
                >
                    <Typography
                        variant='h2'
                        sx={{ padding: '6px 8px' }}
                    >
                        {globalize.translate('HeaderMyMedia')}
                    </Typography>
                </Toolbar>

                <Stack
                    direction='row'
                    spacing={2}
                    useFlexGap
                    className='padded-left padded-right'
                    sx={{
                        flexWrap: 'wrap',
                        // Match card padding
                        paddingTop: '0.6em',
                        paddingBottom: '1.2em'
                    }}
                >
                    {userViews.map(view => (
                        <Button
                            key={`library-button-${view.Id}`}
                            component={Link}
                            to={appRouter.getRouteUrl(view, { context: view.CollectionType }).substring(1)}
                            startIcon={<Icon>{getLibraryIcon(view.CollectionType)}</Icon>}
                            color='inherit'
                            size='large'
                            sx={{
                                width: {
                                    // FIXME: Use theme ref
                                    xs: 'calc(50% - var(--jf-spacing))',
                                    md: 'unset'
                                }
                            }}
                        >
                            {view.Name}
                        </Button>
                    ))}
                </Stack>
            </Box>
        );
    }

    return (
        <SectionContainer
            title={globalize.translate('HeaderMyMedia')}
            items={userViews}
            cardOptions={{
                shape: CardShape.BackdropOverflow,
                showTitle: true,
                centerText: true,
                overlayText: false,
                lazy: true,
                allowBottomPadding: false
            }}
        />
    );
};

export default MyMediaSection;
