// Stubs missing astro dist/assets files — absent from the npm package on some versions due to a
// publish bug. Only creates stubs when the real file is absent so a correct install is unaffected.
// None of these features (experimental fonts, image optimisation) are used by this project.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'node_modules', 'astro', 'dist', 'assets');

const stubs = {
  // base.js: import { localFontFamilySchema, remoteFontFamilySchema } from '.../fonts/config.js'
  'fonts/config.js': 'import{z}from"zod";\nexport const localFontFamilySchema=z.any();\nexport const remoteFontFamilySchema=z.any();\n',

  // create-vite.js: import { getAssetsPrefix } from '.../utils/getAssetsPrefix.js'
  'utils/getAssetsPrefix.js': 'export function getAssetsPrefix(_t,prefix){return prefix??""}\n',

  // create-vite.js: import astroAssetsPlugin from '.../vite-plugin-assets.js'
  'vite-plugin-assets.js': 'export default function astroAssetsPlugin(){return{name:"astro-assets-stub"}}\n',
};

for (const [rel, content] of Object.entries(stubs)) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
    console.log('postinstall: stubbed astro/dist/assets/' + rel);
  }
}
