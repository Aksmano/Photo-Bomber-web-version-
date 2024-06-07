import { TranslationResource } from "../domain/TranslationResource";

const translationPolish: TranslationResource = {
  navbar: {
    title: "Photo Bober",
  },
  photoUpload: {
    header: "Jakiś fajny header z napisem",
    paragraph: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sagittis
            lectus vel sapien venenatis fringilla. Quisque at sodales mauris. Nullam
            efficitur ante ut elit consequat feugiat eu ac enim. Aenean porta nibh
            sit amet pulvinar suscipit.`,
    loadingSpinner: "Wysyłanie...",
    mediaSubmit: {
      videoButton: "Nagraj video",
      photoButton: "Zrób zdjęcie",
      fromGalleryButton: "Dodaj video lub zdjęcie",
      submitButtonPhoto: "Dodaj zdjęcie",
      submitButtonVideo: "Dodaj video",
      successToastPhoto: "Twoje zdjęcie zostało wysłane!",
      successToastVideo: "Twoje video zostało wysłane!",
      errorToast:
        "Coś poszło nie tak podczas wysyłania, spróbuj wysłać ponownie lub przyjdź po pomoc do Pana Młodego",
    },
  },
};

export default translationPolish;
