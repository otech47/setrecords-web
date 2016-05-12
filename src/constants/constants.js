var constants = module.exports = (function() {
    var API_VERSION = 10;

    if (process.env.NODE_ENV == 'production') {
        var API_BASE_URL = 'https://api.setmine.com';
    } else {
        var API_BASE_URL = 'http://localhost:3000';
    }

    var API_ROOT = API_BASE_URL + '/v/' + API_VERSION + '/';
    var API_GRAPH = API_ROOT + 'graphql';

    var S3_ROOT = 'http://stredm.s3-website-us-east-1.amazonaws.com/namecheap/';
    var S3_ROOT_FOR_IMAGES = 'http://d1wbxby8dwa4u.cloudfront.net/namecheap/';
    var DEFAULT_IMAGE = 'ca6a250fc84f30e571a62286fc8c2c16c7ce64b4.png';
    var ANDROID_URL = 'https://play.google.com/store/apps/details?id=com.setmine.android';
    var IOS_URL = 'https://itunes.apple.com/us/app/setmine/id921325688?mt=8';

    return {
        S3_ROOT: S3_ROOT,
        S3_ROOT_FOR_IMAGES: S3_ROOT_FOR_IMAGES,
        DEFAULT_IMAGE: DEFAULT_IMAGE,
        API_GRAPH: API_GRAPH,
        API_ROOT: API_ROOT,
        ANDROID_URL: ANDROID_URL,
        IOS_URL: IOS_URL
    };
})();
