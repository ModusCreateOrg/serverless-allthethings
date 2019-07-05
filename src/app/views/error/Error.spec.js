import cloneDeep from "lodash.clonedeep";

import { createWrapper } from "../../../test/factory/vue/component";
import SattError from "./Error.vue";
import SattBreadcrumbs from "../../components/breadcrumbs/Breadcrumbs.vue";

const mockProps = cloneDeep({ code: "404" });

describe("app | views | error | Error.vue (unit)", () => {
  test("renders", () => {
    expect.assertions(1);
    const wrapper = createWrapper({
      component: SattError,
      customOptions: {
        propsData: mockProps,
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  test("renders SattBreadcrumbs", () => {
    expect.assertions(1);
    const wrapper = createWrapper({
      component: SattError,
      customOptions: {
        propsData: mockProps,
      },
    });
    expect(wrapper.find(SattBreadcrumbs).exists()).toBe(true);
  });

  test("renders error code", () => {
    expect.assertions(1);
    const wrapper = createWrapper({
      component: SattError,
      customOptions: {
        propsData: mockProps,
      },
    });
    expect(wrapper.text()).toContain(mockProps.code);
  });
});

describe("app | views | error | Error.vue (snapshot)", () => {
  test("renders", () => {
    expect.assertions(1);
    const wrapper = createWrapper({
      component: SattError,
      customOptions: {
        propsData: mockProps,
      },
    });
    expect(wrapper.element).toMatchInlineSnapshot(`
      <div
        class="error-container"
      >
        <satt-breadcrumbs-stub
          links="[object Object]"
        />
         
        <h1>
          
          &lt; 404 - Not Found /&gt;
        
        </h1>
      </div>
    `);
  });
});
