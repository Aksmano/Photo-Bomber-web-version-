import { NavbarI18N } from "./navbar/NavbarI18N";
import { PhotoUploadI18N } from "./photo-upload/PhotoUploadI18N";

export enum TranslationResourceKeys {
  PhotoUpload = "photoUpload",
  Navbar = "navbar"
}

export interface TranslationResource {
  photoUpload: PhotoUploadI18N;
  navbar: NavbarI18N
}
