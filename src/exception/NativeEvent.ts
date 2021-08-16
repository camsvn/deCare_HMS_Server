import Log from '../middlewares/Log';

class NativeEvent {
    public process() : void {
        process.on('uncaughtException', (exception: Error) => {
            Log.error(exception.stack || exception.message);
        });

        process.on('warning', (warning: Error) => {
            Log.warn(warning.stack || warning.message);
        })

        //catches ctrl+c event
        process.on('SIGINT', () => {
            console.log('\x1b[41m\x1b[30m%s\x1b[0m','Server :: Exit command received!!');
            process.exit();
        });
    }
}

export default new NativeEvent;