import { c as createComponent } from './astro-component_DaTm77EN.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate } from './entrypoint_B5MFWxs-.mjs';

const prerender = false;
const $$KeystaticAstroPage = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Keystatic", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/adam_/TOH/travel-old-hollywood/node_modules/@keystatic/astro/internal/keystatic-page.js", "client:component-export": "Keystatic" })}`;
}, "C:/Users/adam_/TOH/travel-old-hollywood/node_modules/@keystatic/astro/internal/keystatic-astro-page.astro", void 0);

const $$file = "C:/Users/adam_/TOH/travel-old-hollywood/node_modules/@keystatic/astro/internal/keystatic-astro-page.astro";
const $$url = undefined;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$KeystaticAstroPage,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
