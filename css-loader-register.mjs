// Register a custom loader to ignore CSS imports
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('./css-loader-hooks.mjs', pathToFileURL('./'));
