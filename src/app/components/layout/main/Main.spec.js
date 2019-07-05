import { createWrapper } from "../../../../test/factory/vue/component";
import SattMain from "./Main.vue";

describe("app | components | layout | main | Main.vue (unit)", () => {
  test("renders", () => {
    expect.assertions(1);
    const wrapper = createWrapper({ component: SattMain });
    expect(wrapper.exists()).toBe(true);
  });

  test("renders router view", () => {
    expect.assertions(1);
    const wrapper = createWrapper({ component: SattMain });
    // Can't import "RouterView" component; using "router-view-stub" string instead
    expect(wrapper.find("router-view-stub").exists()).toBe(true);
  });
});

describe("app | components | layout | main | Main.vue (snapshot)", () => {
  test("renders", () => {
    expect.assertions(1);
    const wrapper = createWrapper({ component: SattMain });
    expect(wrapper.element).toMatchInlineSnapshot(`
<main
  class="layout-main-container"
>
  <router-view-stub
    name="default"
  />
</main>
`);
  });
});
