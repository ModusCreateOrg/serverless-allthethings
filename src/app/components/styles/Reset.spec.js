import { createWrapper } from "../../../test/factory/vue/component";
import SattReset from "./Reset.vue";

describe("app | components | styles | Reset.vue (unit)", () => {
  test("renders", () => {
    const wrapper = createWrapper({ component: SattReset });
    expect(wrapper.exists()).toBe(true);
  });
});

describe("app | components | styles | Reset.vue (snapshot)", () => {
  test("renders", () => {
    expect.assertions(1);
    const wrapper = createWrapper({ component: SattReset });
    expect(wrapper.element).toMatchInlineSnapshot(`
<div
  class="styles-reset-container"
/>
`);
  });
});
