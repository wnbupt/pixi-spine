import configBuilder from '@pixi-spine-patch/rollup-config';
import pkg from './package.json' assert { type: 'json' };

export default configBuilder(pkg.extensionConfig, pkg);
