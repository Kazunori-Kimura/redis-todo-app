// index.js
const riot = require("riot");
require("whatwg-fetch"); //fetchのpolyfill
require("./tags"); //riotのtag

const observer = riot.observable();

// tagのマウント
riot.mount("*", { observer });
