import App from './providers/App';
import NativeEvent from './exception/NativeEvent';

NativeEvent.process();
App.loadDatabase();
App.loadServer();