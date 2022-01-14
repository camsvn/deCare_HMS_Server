import { Application, json, static as serveStatic} from 'express';
import helmet from 'helmet';


import Log from './Log';
import Locals from '../providers/Locals';

class Http {
    public static mount(_express: Application): Application {
        Log.info('Booting the \'HTTP\' middleware...');

        _express.use(json({
            limit: Locals.config().maxUploadLimit
        }))

        _express.use(serveStatic('public'))
        
        /**
         * https://expressjs.com/en/advanced/best-practice-security.html
         * Security overheads
         */
        _express.use(helmet({
            contentSecurityPolicy: false,
        }));
        _express.use(helmet.contentSecurityPolicy({
            useDefaults: false,
            directives: {
                "script-src": ["'self'", "'sha256-smeKlzoBksVYJbpIwiP/yNzhQLzmXzVRkIh1Wvvydz4='", 'cdnjs.cloudflare.com'],
                'default-src': [ "'self'" ],
                'base-uri': [ "'self'" ],
                'block-all-mixed-content': [],
                'font-src': [ "'self'", 'https:', 'data:' ],       
                'frame-ancestors': [ "'self'" ],
                'img-src': [ "'self'", 'data:' ],
                'object-src': [ "'none'" ],
                'script-src-attr': [ "'none'" ],
                'style-src': [ "'self'", 'https:', "'unsafe-inline'" ],
                /**
                 * Instructs user agent to treat all of sites insecure URLs
                 * as thought they have been replaced with secure URLs
                 * 
                 * Ref: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/upgrade-insecure-requests
                 */
                // 'upgrade-insecure-requests': []
            },
        }));

        return _express;
    }
}

export default Http;