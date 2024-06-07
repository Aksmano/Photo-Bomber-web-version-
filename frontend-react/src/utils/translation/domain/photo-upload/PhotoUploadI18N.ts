import { MediaSubmitI18N } from "./subkeys/MediaSubmitI18N";

export enum PhotoUploadI18NKeys {
  Header = "header",
  Paragraph = "paragraph",
  LoadingSpinner = "loadingSpinner",
  MediaSubmit = "mediaSubmit",
}

export interface PhotoUploadI18N {
  header: string;
  paragraph: string;
  loadingSpinner: string;
  mediaSubmit: MediaSubmitI18N;
}
