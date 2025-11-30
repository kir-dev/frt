// Loader hooks to ignore CSS imports
export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith('.css') || specifier.endsWith('.scss')) {
    // Return a virtual module URL
    return {
      format: 'module',
      shortCircuit: true,
      url: `ignored-css:${specifier}`
    };
  }
  
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.startsWith('ignored-css:')) {
    return {
      format: 'module',
      shortCircuit: true,
      source: 'export default {};'
    };
  }
  
  return nextLoad(url, context);
}
