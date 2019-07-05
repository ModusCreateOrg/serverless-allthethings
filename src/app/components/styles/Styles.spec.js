import { createWrapper } from "../../../test/factory/vue/component";
import SattStyles from "./Styles.vue";
import SattStylesReset from "./Reset.vue";
import SattStylesCustom from "./Custom.vue";

describe("app | components | styles | Styles.vue (unit)", () => {
  test("renders", () => {
    const wrapper = createWrapper({ component: SattStyles });
    expect(wrapper.exists()).toBe(true);
  });

  test("renders SattStylesReset", () => {
    const wrapper = createWrapper({ component: SattStyles });
    expect(wrapper.find(SattStylesReset).exists()).toBe(true);
  });

  test("renders SattStylesCustom", () => {
    const wrapper = createWrapper({ component: SattStyles });
    expect(wrapper.find(SattStylesCustom).exists()).toBe(true);
  });
});

describe("app | components | styles | Styles.vue (snapshot)", () => {
  test("renders", () => {
    expect.assertions(1);
    const wrapper = createWrapper({ component: SattStyles });
    expect(wrapper.element).toMatchInlineSnapshot(`
      <div
        class="styles-container"
      >
        <satt-styles-reset-stub />
         
        <satt-styles-custom-stub />
      </div>
    `);
  });
});
