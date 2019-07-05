import { createWrapper } from "../../../test/factory/vue/component";
import SattPwa from "./Pwa.vue";

describe("app | views | pwa | Pwa.vue (unit)", () => {
  test("renders", () => {
    expect.assertions(1);
    const wrapper = createWrapper({ component: SattPwa });
    expect(wrapper.exists()).toBe(true);
  });
});

describe("app | views | pwa | Pwa.vue (snapshot)", () => {
  test("renders", () => {
    expect.assertions(1);
    const wrapper = createWrapper({ component: SattPwa });
    expect(wrapper.element).toMatchInlineSnapshot(`
<div
  class="pwa-container"
>
  <h1>
    &lt; Serverless AllTheThings /&gt;
  </h1>
</div>
`);
  });
});
