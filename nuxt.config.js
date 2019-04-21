const pkg = require("./package.json");

module.exports = {
    /*
     ** Headers of the page
     */
    head: {
        title: "Face chat",
        meta: [
            { charset: "utf-8" },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1"
            },
            {
                hid: "description",
                name: "description",
                content: ""
            }
        ],
        link: [
            /*,
            {
                rel: 'icon',
                type: 'image/png',
                href: `/${pkg.name}/favicon.png`
            },*/
            {
                rel: "stylesheet",
                href:
                    "//fonts.googleapis.com/css?family=Roboto:100,200,300,400,500,700,400italic|Material+Icons"
            }
        ]
    },
    render: {
        ssr: false
    },
    router: {
        base: `/face-chat/`
    },
    modules: [
        [
            "nuxt-fire",
            {
                config: {
                    development: {
                        apiKey: "AIzaSyB6TADvrO8ijXUJboo4LEVZrm22Jg623QA",
                        authDomain: "face-chat-baa50.firebaseapp.com",
                        databaseURL: "https://face-chat-baa50.firebaseio.com",
                        projectId: "face-chat-baa50",
                        storageBucket: "face-chat-baa50.appspot.com",
                        messagingSenderId: "53996637101"
                    },
                    production: {
                        apiKey: "AIzaSyB6TADvrO8ijXUJboo4LEVZrm22Jg623QA",
                        authDomain: "face-chat-baa50.firebaseapp.com",
                        databaseURL: "https://face-chat-baa50.firebaseio.com",
                        projectId: "face-chat-baa50",
                        storageBucket: "face-chat-baa50.appspot.com",
                        messagingSenderId: "53996637101"
                    }
                }
            }
        ]
    ],

    /*
     ** Global CSS
     */
    css: [
        {
            src: "vue-material/dist/vue-material.min.css",
            lang: "css"
        },
        {
            src: "~/assets/theme.scss",
            lang: "scss"
        }
    ],
    plugins: [
        {
            src: "~/plugins/vue-material"
        },
        {
            src: "~/plugins/chat-scroll"
        }
    ],
    build: {
        vendor: ["vue-material"],
        html: {
            minify: {
                collapseWhitespace: false,
                removeEmptyAttributes: false
            }
        },
        /*
         ** Run ESLINT on save
         */
        extend(config, ctx) {
            if (ctx.isClient && process.env.NODE_ENV !== "production") {
                config.module.rules.push({
                    enforce: "pre",
                    test: /\.(js|vue)$/,
                    loader: "eslint-loader",
                    exclude: /(node_modules)/
                });
            }
        }
    }
};
