/**
 * Creates & maintains the log
 */

 import * as fs from 'fs';
 import * as path from 'path';
 import cron from 'node-cron';

 import Locals from '../providers/Locals';

 
 class Log {
     public baseDir: string;
     public fileName: string;
     public linePrefix: string;
 
     public today: Date = new Date();
 
     constructor() {
        let _dateString = `${this.today.getFullYear()}-${(this.today.getMonth() + 1)}-${this.today.getDate()}`;
        let _timeString = `${this.today.getHours()}:${this.today.getMinutes()}:${this.today.getSeconds()}`;
 
        this.baseDir = path.join(__dirname, '../../.logs/');
 
        this.fileName = `${_dateString}.log`;
        this.linePrefix = `[${_dateString} ${_timeString}]`;
        this.custom('INIT', 'Server :: Starting...');
        this.clean();
        this.mountCRONS();
     }
 
     // Adds INFO prefix string to the log string
     public info (_string: string): void {
         this.addLog('INFO', _string);
     }
 
     // Adds WARN prefix string to the log string
     public warn (_string: string): void {
         this.addLog('WARN', _string);
     }
 
     // Adds ERROR prefix string to the log string
     public error (_string: string): void {
         // Line break and show the first line
         if (_string.indexOf('Path') != 0)
            console.log('\x1b[31m%s\x1b[0m', '[ERROR] :: ' + _string.split(/r?\n/)[0]);
 
         this.addLog('ERROR', _string);
     }
 
     // Adds the custom prefix string to the log string
     public custom (_filename: string, _string: string): void {
         this.addLog(_filename, _string);
     }
 
     /**
      * Creates the file if does not exist, and
      * append the log kind & string into the file.
      */
     private addLog (_kind: string, _string: string): void {
         const _that = this;
         _kind = _kind.toUpperCase();
 
         fs.open(`${_that.baseDir}${_that.fileName}`, 'a', (_err, _fileDescriptor) => {
             if (!_err && _fileDescriptor) {
                 // Append to file and close it
                 fs.appendFile(_fileDescriptor, `${_that.getTimeStamp()} [${_kind}] ${_string}\n`, (_err) => {
                     if (! _err) {
                         fs.close(_fileDescriptor, (_err) => {
                             if (! _err) {
                                 return true;
                             } else {
                                 return console.log('\x1b[31m%s\x1b[0m', 'Error closing log file that was being appended');
                             }
                         });
                     } else {
                         return console.log('\x1b[31m%s\x1b[0m', 'Error appending to the log file');
                     }
                 });
             } else {
                 return console.log('\x1b[31m%s\x1b[0m', 'Error cloudn\'t open the log file for appending');
             }
         });
     }
 
     /**
      * Deletes the log files older than 'X' days
      *
      * Note: 'X' is defined in .env file
      */
     public clean (): void {
        let today = new Date();
        let oldDate = this.subtractDays(Locals.config().logDays, today);
        let _dateString = `${oldDate.getFullYear()}-${(oldDate.getMonth() + 1)}-${oldDate.getDate()}`;
        let matureFileName = `${_dateString}.log`;
        fs.unlink(`${this.baseDir}\\${matureFileName}`, (_err) => {
            if (! _err) {
                this.info(`Log :: File '${matureFileName}' deleted`);
            }
        });
     }
     
     private mountCRONS(): void {
         cron.schedule('0 0 * * *', () => {
             this.info('Log :: CRON process started');
             this.clean();
             this.createNewFile();
         })
     }

     private getTimeStamp (): string {
        let today = new Date();
        let _dateString = `${today.getFullYear()}-${(today.getMonth() + 1)}-${today.getDate()}`;
        let _timeString = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
        return `[${_dateString} ${_timeString}]`;
    }

     private createNewFile (): void {
        let today = new Date();
        let _dateString = `${today.getFullYear()}-${(today.getMonth() + 1)}-${today.getDate()}`;        
        
        this.info(`Log :: Creating new File ${_dateString}.log`);
        this.fileName = `${_dateString}.log`;
        this.info(`Log :: ${_dateString}.log created`);

     }

     private subtractDays(days: number, date: Date) {
        let newDate = new Date(date.getTime());
        newDate.setDate(date.getDate() - days);
        return newDate;
    };
 }
 
 export default new Log;