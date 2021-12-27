export class FileTypeException extends Error {
  code:string;
  constructor(message: string) {
    super(message);
    this.name = "FileTypeException";
    this.code = "TYPE_UNEXPECTED_FILE"
  }
}