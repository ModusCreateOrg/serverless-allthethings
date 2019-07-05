import { createWrapper } from "../../../test/factory/vue/component";
import SattLayout from "./Layout.vue";
import SattStyles from "../styles/Styles.vue";
import SattFooter from "./footer/Footer.vue";
import SattHeader from "./header/Header.vue";
import SattMain from "./main/Main.vue";

describe("app | components | layout | Layout.vue (unit)", () => {
  test("renders", () => {
    expect.assertions(1);
    const wrapper = createWrapper({ component: SattLayout });
    expect(wrapper.exists()).toBe(true);
  });

  test("renders SattStyles", () => {
    expect.assertions(1);
    const wrapper = createWrapper({ component: SattLayout });
    expect(wrapper.find(SattStyles).exists()).toBe(true);
  });

  test("renders SattHeader", () => {
    expect.assertions(1);
    const wrapper = createWrapper({ component: SattLayout });
    expect(wrapper.find(SattHeader).exists()).toBe(true);
  });

  test("renders SattMain", () => {
    expect.assertions(1);
    const wrapper = createWrapper({ component: SattLayout });
    expect(wrapper.find(SattMain).exists()).toBe(true);
  });

  test("renders SattFooter", () => {
    expect.assertions(1);
    const wrapper = createWrapper({ component: SattLayout });
    expect(wrapper.find(SattFooter).exists()).toBe(true);
  });
});

describe("app | components | layout | Layout.vue (snapshot)", () => {
  test("renders", () => {
    expect.assertions(1);
    const wrapper = createWrapper({ component: SattLayout });
    expect(wrapper.element).toMatchInlineSnapshot(`
      <div
        class="layout-container"
        id="serverless-allthethings"
      >
        <satt-styles-stub />
         
        <satt-header-stub />
         
        <div
          class="main-container"
        >
          <satt-main-stub />
        </div>
         
        <satt-footer-stub />
      </div>
    `);
  });
});
