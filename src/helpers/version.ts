import * as fs from 'fs';
import * as path from 'path';

/**
 * The running build's version, read once from the `package.json` in the
 * working directory. The release bundle ships that file next to the bundled
 * script and the service starts in that folder, so this is the version that
 * was deployed; in development it is the checkout's.
 */
export const appVersion: string = (() => {
    try {
        const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
        return typeof pkg.version === 'string' ? pkg.version : 'unknown';
    } catch {
        return 'unknown';
    }
})();
