export interface IFile {
  fileType: FileType;
  filePath: string;
}

export enum FileType {
  XML = "xml",
  JSON = "json",
}
