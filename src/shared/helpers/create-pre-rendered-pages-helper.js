const fs = require("fs");
const path = require("path");

const SsrHelper = require("./ssr-helper").default;

function saveHtmlForUri({ html, uri }) {
  const directory = path.resolve(__dirname, `../../../dist/static${uri}`);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  fs.writeFileSync(path.resolve(directory, `index.html`), html);
}

function createPreRenderedPage({ uri }) {
  SsrHelper.getHtml({ uri }).then((html) => {
    saveHtmlForUri({
      html,
      uri,
    });
  });
}

function createPreRenderedPages() {
  const preRenderedPageUris = ["/", "/pwa"];
  for (const preRenderedPageUri of preRenderedPageUris) {
    createPreRenderedPage({ uri: preRenderedPageUri });
  }
}

module.exports = {
  createPreRenderedPages,
};
