<template>
  <div class="styles-container">
    <satt-styles-reset />
    <satt-styles-custom />
  </div>
</template>

<script>
// Imports ordered intentially for <style> order in <head> of rendered HTML
import SattStylesReset from "./Reset.vue";
import SattStylesCustom from "./Custom.vue";

export default {
  components: {
    SattStylesCustom,
    SattStylesReset,
  },
  name: "SattStyles",
};
</script>

<style lang="scss">
.styles-container {
  display: none;
}
</style>
