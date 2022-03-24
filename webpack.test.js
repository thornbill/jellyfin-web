const common = require('./webpack.common');
const { merge } = require('webpack-merge');

const TEST_SERVER = process.env.JF_TEST_SERVER || 'https://demo.jellyfin.org/stable';

// Complete list of server api endpoints (hopefully)
const API_PATHS = [
    'albums',
    'artists',
    'audio',
    'auth',
    'branding',
    'channels',
    'collections',
    'devices',
    'displaypreferences',
    'dlna',
    'environment',
    'fallbackfont',
    'genres',
    'getutctime',
    'images',
    'items',
    'libraries',
    'library',
    'livestreams',
    'livetv',
    'localization',
    'movies',
    'musicgenres',
    'notifications',
    'packages',
    'persons',
    'playback',
    'playlists',
    'plugins',
    'quickconnect',
    'scheduledtasks',
    'search',
    'sessions',
    'shows',
    'songs',
    'startup',
    'studios',
    'syncplay',
    'system',
    'trailers',
    'users',
    'videos',
    'years'
];

// Check if a path is a server api endpoint
const isApiPath = (path = '/') => {
    const rootPath = path.split('/')[1].toLowerCase();
    return API_PATHS.includes(rootPath);
};

module.exports = merge(common, {
    mode: 'development',
    entry: './scripts/site.js',
    devServer: {
        compress: true,
        liveReload: false,
        port: 8080,
        client: {
            overlay: {
                errors: true,
                warnings: false
            }
        },
        proxy: [
            {
                context: isApiPath,
                target: TEST_SERVER,
                changeOrigin: true
            }
        ]
    }
});
