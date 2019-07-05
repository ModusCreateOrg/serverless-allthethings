import { createWrapper } from "../../../../test/factory/vue/component";
import SattHeader from "./Header.vue";

describe("app | components | layout | header | Header.vue (unit)", () => {
  test("renders", () => {
    expect.assertions(1);
    const wrapper = createWrapper({ component: SattHeader });
    expect(wrapper.exists()).toBe(true);
  });

  test("renders img for logo", () => {
    expect.assertions(1);
    const wrapper = createWrapper({ component: SattHeader });
    expect(wrapper.find("img").exists()).toBe(true);
  });
});

describe("app | components | layout | header | Header.vue (snapshot)", () => {
  test("renders", () => {
    expect.assertions(1);
    const wrapper = createWrapper({ component: SattHeader });
    expect(wrapper.element).toMatchInlineSnapshot(`
<header
  class="layout-header-container"
>
  <router-link-stub
    event="click"
    exact="true"
    tag="a"
    title="Serverless AllTheThings"
    to="[object Object]"
  >
    <img
      alt="Serverless AllTheThings Logo"
      src="[object Object]"
      title="Serverless AllTheThings"
    />
  </router-link-stub>
</header>
`);
  });
});
