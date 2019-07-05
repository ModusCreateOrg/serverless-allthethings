<template>
  <div id="serverless-allthethings" class="layout-container">
    <satt-styles />
    <satt-header />
    <div class="main-container">
      <satt-main />
    </div>
    <satt-footer />
  </div>
</template>

<script>
// Imports ordered intentially for <style> order in <head> of rendered HTML
import SattStyles from "../styles/Styles.vue";
import SattFooter from "./footer/Footer.vue";
import SattHeader from "./header/Header.vue";
import SattMain from "./main/Main.vue";

const SATT = "Serverless AllTheThings";
const THEME_COLOR = "#AA00FF";

export default {
  components: {
    // Components ordered intentially for <style> order in <head> of rendered HTML
    SattFooter,
    SattHeader,
    SattMain,
    SattStyles,
  },
  data() {
    return {
      isPreventingScroll: false,
    };
  },
  name: "SattLayout",
  metaInfo() {
    return {
      htmlAttrs: {
        lang: "en",
      },
      link: [
        {
          href: require("./favicon-16x16.png"),
          rel: "icon",
          sizes: "16x16",
          type: "image/png",
        },
        {
          href: require("./favicon-32x32.png"),
          rel: "icon",
          sizes: "32x32",
          type: "image/png",
        },
        {
          href: "/favicon.ico",
          rel: "icon",
          sizes: "16x16 32x32 48x48",
          type: "image/x-icon",
        },
        {
          href: "/site.webmanifest",
          rel: "manifest",
        },
        {
          color: "#AA00FF",
          href: "/safari-pinned-tab.svg",
          rel: "mask-icon",
        },
      ],
      meta: [
        { charset: "utf-8" },
        {
          content: SATT,
          name: "description",
          property: "og:description",
          vmid: "description",
        },
        {
          content: "article",
          property: "og:type",
        },
        {
          content: "index, follow",
          name: "robots",
          vmid: "robots",
        },
        {
          content: "width=device-width, initial-scale=1",
          name: "viewport",
        },
        {
          content: SATT,
          name: "copyright",
        },
        {
          content: SATT,
          name: "application-name",
        },
        {
          content: SATT,
          name: "apple-mobile-web-app-title",
        },
        {
          content: "/browserconfig.xml",
          name: "msapplication-config",
        },
        {
          content: THEME_COLOR,
          name: "theme-color",
        },
        {
          content: "yes",
          name: "mobile-web-app-capable",
        },
        {
          content: "yes",
          name: "apple-mobile-web-app-capable",
        },
        {
          content: "black",
          name: "apple-mobile-web-app-status-bar-style",
        },
        {
          content: THEME_COLOR,
          name: "msapplication-TileColor",
        },
        {
          content: "/logo-144x144.png",
          name: "msapplication-TileImage",
        },
      ],
      noscript: [
        {
          innerHTML: `${SATT} does not work properly without JavaScript enabled. Please enable it to continue.`,
        },
      ],
      title: SATT,
      titleTemplate: (titleChunk) => {
        return titleChunk ? `${titleChunk} | ${SATT}` : SATT;
      },
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/theme";
@import "../styles/responsive";

.layout-container {
  // NOTE: SSR will inline SattLayout's styles above those in SattStyles
  /* stylelint-disable-next-line scss/at-function-named-arguments */
  padding: 0 env(safe-area-inset-right) 0 env(safe-area-inset-left);
  position: relative;

  > header,
  > footer,
  > .main-container {
    transition: filter 250ms;
  }

  > .main-container {
    background-color: $primary-color;
    min-height: $main-min-height;
    overflow-x: hidden;
    position: relative;
  }
}
</style>
