import {defineConfig} from 'vite'
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
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    const antd = {
                        antd_color_picker: "antd/es/color-picker",
                        antd_form: "antd/es/form",
                        antd_modal: "antd/es/modal",
                        antd_typography: "antd/es/typography",
                        antd_table: "antd/es/table",
                        antd_select: "antd/es/select",
                    };

                    for (const key in antd) {
                        if (id.includes(antd[key as keyof typeof antd])) {
                            return key;
                        }
                    }

                    if (id.includes("antd/es")) {
                        return "antd_rest";
                    }

                    if (id.includes("@ant-design")) {
                        return "antd_assets";
                    }
                },
            },
        },
    },
})