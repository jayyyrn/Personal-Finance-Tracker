// Compatibility shim — explicitly import from the TSX implementation so this
// file doesn't accidentally import itself (which happens when resolving './useApi' from a .js file).
import * as mod from './useApi.tsx';

export * from './useApi.tsx';

// Provide a sensible default export for consumers importing the .js path.
// Avoid referencing `mod.default` because the TSX module does not export a default
// and referencing it can cause static analysis errors during bundling.
const defaultExport = mod.useApi ?? mod.useAsyncAction ?? mod;
export default defaultExport;
