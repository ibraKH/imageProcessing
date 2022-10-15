"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const routers_1 = __importDefault(require("./routers/routers"));
const app = (0, express_1.default)();
// https://www.npmjs.com/package/express-fileupload
// package to help with files in express
app.use((0, express_fileupload_1.default)());
// to use static file , image , html pages
app.use(express_1.default.static('./build/public'));
app.use('/', routers_1.default);
const port = 3004;
// Home Page
app.get('/', (req, res) => {
    // rendering html page as main page
    res.render('index.html');
});
// Block unused pages
app.get('*', (req, res) => {
    res.status(404).sendFile(__dirname + '/public/notFound.html');
});
app.listen(port, () => console.log(`Listening on port : ${port}`));
exports.default = app;
