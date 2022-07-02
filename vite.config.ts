import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dynamicImport from 'vite-plugin-dynamic-import';
// import raw from 'vite-plugin-raw';

var htmlRE = /\.html$/;
var rawHtml = () => ({
    name: 'vite-plugin-raw-html',
    transform: (src, id) => {
        if (htmlRE.test(id)) {
            return `export default ${JSON.stringify(src)}`;
        }
    }
});

export default defineConfig({
    root: './src',
    resolve: {
        // Add ".html" to default extensions
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.html']
    },
    plugins: [
        dynamicImport(),
        // raw({ match: /\.html$/ }),
        rawHtml(),
        react()
    ]
});
