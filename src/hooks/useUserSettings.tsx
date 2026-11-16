import React, { type FC, type PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { DEFAULT_SECTIONS, HomeSectionType } from 'constants/homeSectionType';
import { FALLBACK_CULTURE } from 'lib/globalize';
import { currentSettings as userSettings } from 'scripts/settings/userSettings';
import Events, { type Event } from 'utils/events';

import { useApi } from './useApi';

interface UserSettings {
    /** User defined custom CSS to apply to the app */
    customCss?: string
    /** Whether the user has disabled custom CSS or not */
    disableCustomCss: boolean
    /** The sections to show on the home page in order */
    homeSections: HomeSectionType[]
    /** Whether previously watched items should be shown in next up */
    enableRewatchingInNextUp: boolean
    /** The maximum number of days to show an item in next up */
    maxDaysForNextUp: number
    /** Use episode images in next up and resume sections instead of parent item images */
    useEpisodeImagesInNextUpAndResume: boolean
    /** The main app theme ID */
    theme?: string
    /** The admin dashboard theme ID */
    dashboardTheme?: string
    /** The locale to use for date time formatting */
    dateTimeLocale?: string
    /** The locale to use for translations */
    language?: string
    /** The number of items to display per page in the library */
    libraryPageSize: number
}

// NOTE: This is an incomplete list of only the settings that are currently being used
const UserSettingField = {
    // Custom CSS
    CustomCss: 'customCss',
    DisableCustomCss: 'disableCustomCss',
    // Home sections
    HomeSection0: 'homesection0',
    HomeSection1: 'homesection1',
    HomeSection2: 'homesection2',
    HomeSection3: 'homesection3',
    HomeSection4: 'homesection4',
    HomeSection5: 'homesection5',
    HomeSection6: 'homesection6',
    HomeSection7: 'homesection7',
    HomeSection8: 'homesection8',
    HomeSection9: 'homesection9',
    // Next up and resume settings
    EnableRewatchingInNextUp: 'enableRewatchingInNextUp',
    MaxDaysForNextUp: 'maxDaysForNextUp',
    UseEpisodeImagesInNextUpAndResume: 'useEpisodeImagesInNextUpAndResume',
    // Theme settings
    Theme: 'appTheme',
    DashboardTheme: 'dashboardTheme',
    // Locale settings
    DateTimeLocale: 'datetimelocale',
    Language: 'language',
    // Library settings
    LibraryPageSize: 'libraryPageSize'
};

const DEFAULT_LIBRARY_PAGE_SIZE = 100;

const UserSettingsContext = createContext<UserSettings>({
    disableCustomCss: false,
    libraryPageSize: DEFAULT_LIBRARY_PAGE_SIZE,
    homeSections: DEFAULT_SECTIONS,
    enableRewatchingInNextUp: false,
    maxDaysForNextUp: 365,
    useEpisodeImagesInNextUpAndResume: false
});

export const useUserSettings = () => useContext(UserSettingsContext);

export const UserSettingsProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
    const [ customCss, setCustomCss ] = useState<string>();
    const [ disableCustomCss, setDisableCustomCss ] = useState(false);
    const [ homeSections, setHomeSections ] = useState<HomeSectionType[]>([]);
    const [ enableRewatchingInNextUp, setEnableRewatchingInNextUp ] = useState(false);
    const [ maxDaysForNextUp, setMaxDaysForNextUp ] = useState(365);
    const [ useEpisodeImagesInNextUpAndResume, setUseEpisodeImagesInNextUpAndResume ] = useState(false);
    const [ theme, setTheme ] = useState<string>();
    const [ dashboardTheme, setDashboardTheme ] = useState<string>();
    const [ dateTimeLocale, setDateTimeLocale ] = useState<string>();
    const [ language, setLanguage ] = useState<string | undefined>(FALLBACK_CULTURE);
    const [ libraryPageSize, setLibraryPageSize ] = useState<number>(DEFAULT_LIBRARY_PAGE_SIZE);

    const { user } = useApi();

    const context = useMemo<UserSettings>(() => ({
        customCss,
        disableCustomCss,
        homeSections,
        enableRewatchingInNextUp,
        maxDaysForNextUp,
        useEpisodeImagesInNextUpAndResume,
        theme,
        dashboardTheme,
        dateTimeLocale,
        locale: language,
        libraryPageSize
    }), [
        customCss,
        disableCustomCss,
        homeSections,
        enableRewatchingInNextUp,
        maxDaysForNextUp,
        useEpisodeImagesInNextUpAndResume,
        theme,
        dashboardTheme,
        dateTimeLocale,
        language,
        libraryPageSize
    ]);

    // Update the values of the user settings
    const updateUserSettings = useCallback(() => {
        setCustomCss(userSettings.customCss());
        setDisableCustomCss(userSettings.disableCustomCss());
        setHomeSections([
            userSettings.get(UserSettingField.HomeSection0) as HomeSectionType || DEFAULT_SECTIONS[0],
            userSettings.get(UserSettingField.HomeSection1) as HomeSectionType || DEFAULT_SECTIONS[1],
            userSettings.get(UserSettingField.HomeSection2) as HomeSectionType || DEFAULT_SECTIONS[2],
            userSettings.get(UserSettingField.HomeSection3) as HomeSectionType || DEFAULT_SECTIONS[3],
            userSettings.get(UserSettingField.HomeSection4) as HomeSectionType || DEFAULT_SECTIONS[4],
            userSettings.get(UserSettingField.HomeSection5) as HomeSectionType || DEFAULT_SECTIONS[5],
            userSettings.get(UserSettingField.HomeSection6) as HomeSectionType || DEFAULT_SECTIONS[6],
            userSettings.get(UserSettingField.HomeSection7) as HomeSectionType || DEFAULT_SECTIONS[7],
            userSettings.get(UserSettingField.HomeSection8) as HomeSectionType || DEFAULT_SECTIONS[8],
            userSettings.get(UserSettingField.HomeSection9) as HomeSectionType || DEFAULT_SECTIONS[9]
        ]);
        setEnableRewatchingInNextUp(userSettings.enableRewatchingInNextUp());
        setMaxDaysForNextUp(userSettings.maxDaysForNextUp());
        setUseEpisodeImagesInNextUpAndResume(userSettings.useEpisodeImagesInNextUpAndResume());
        setTheme(userSettings.theme());
        setDashboardTheme(userSettings.dashboardTheme());
        setDateTimeLocale(userSettings.dateTimeLocale());
        setLanguage(userSettings.language());
        setLibraryPageSize(userSettings.libraryPageSize() ?? DEFAULT_LIBRARY_PAGE_SIZE);
    }, []);

    const onUserSettingsChange = useCallback((_e: Event, name?: string) => {
        if (name && Object.values(UserSettingField).includes(name)) {
            updateUserSettings();
        }
    }, [ updateUserSettings ]);

    // Handle user settings changes
    useEffect(() => {
        Events.on(userSettings, 'change', onUserSettingsChange);

        return () => {
            Events.off(userSettings, 'change', onUserSettingsChange);
        };
    }, [ onUserSettingsChange ]);

    // Update the settings if the user changes
    useEffect(() => {
        updateUserSettings();
    }, [ updateUserSettings, user ]);

    return (
        <UserSettingsContext.Provider value={context}>
            {children}
        </UserSettingsContext.Provider>
    );
};
