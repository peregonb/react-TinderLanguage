import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@redux': path.resolve(__dirname, './src/redux'),
            '@components': path.resolve(__dirname, './src/components'),
            '@pages': path.resolve(__dirname, './src/pages'),
            '@hooks': path.resolve(__dirname, './src/helpers/hooks'),
            '@styles': path.resolve(__dirname, './src/assets/styles'),
        },
        // extensions: ['.ts', '.tsx', '.js', '.css', '.scss']
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@styles/resources.scss";`,
            },
        },
    },
    plugins: [react()],
})