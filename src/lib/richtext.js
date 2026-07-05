// True when a fields.markdoc.inline reader value has any actual content.
// Empty fields still come back as { node } with no children, which is truthy,
// so layouts must use this instead of a plain `value &&` guard.
export function hasRichText(value) {
  return (value?.node?.children?.length ?? 0) > 0;
}
