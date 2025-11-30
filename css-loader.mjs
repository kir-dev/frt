// Node.js ESM loader to ignore CSS/SCSS imports
export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith('.css') || specifier.endsWith('.scss')) {
    return {
      format: 'module',
      shortCircuit: true,
      url: new URL('data:text/javascript,export default {}').href
    };
  }
  
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  // If URL is a CSS/SCSS file, return empty module
  if (url.includes('.css') || url.includes('.scss')) {
    return {
      format: 'module',
      shortCircuit: true,
      source: 'export default {};'
    };
  }
  
  return nextLoad(url, context);
}
