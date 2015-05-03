({
    appDir: "/",
    baseUrl: "js_dev",
    dir: "js",
    paths: {
        'react': 'lib/react.min',
        'jquery': 'lib/jquery-2.1.1.min'
    },
    modules: [
        //First set up the common build layer.
        {
            //module names are relative to baseUrl
            name: 'app'
        }
    ]
})