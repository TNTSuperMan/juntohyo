import index from "../index.html";

export default {
    routes: {
        "/*": index,
    },
    fetch() {},
    development: {
        console: true,
        hmr: true,
    },
}
