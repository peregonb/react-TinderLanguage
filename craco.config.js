const path = require("path");

module.exports = {
    webpack: {
        alias: {
            '@redux': path.resolve(__dirname, 'src/redux/'),
            '@components': path.resolve(__dirname, 'src/components/'),
            '@pages': path.resolve(__dirname, 'src/pages/'),
            '@hooks': path.resolve(__dirname, 'src/helpers/hooks'),
        }
    }
};