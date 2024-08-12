import { NavbarI18N } from "./navbar/NavbarI18N";
import { PhotoUploadI18N } from "./photo-upload/PhotoUploadI18N";
import { ToastI18N } from "./toast/ToastI18N";
import { VideoRecorderI18N } from "./video-recorder/VideoRecorderI18N";

export enum TranslationResourceKeys {
  PhotoUpload = "photoUpload",
  Navbar = "navbar",
  Toast = "toast",
  VideoRecorder = "videoRecorder",
}

export interface TranslationResource {
  photoUpload: PhotoUploadI18N;
  navbar: NavbarI18N;
  toast: ToastI18N;
  videoRecorder: VideoRecorderI18N;
}
