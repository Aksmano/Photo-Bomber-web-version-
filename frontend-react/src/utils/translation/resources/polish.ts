import { TranslationResource } from "../domain/TranslationResource";

const translationPolish: TranslationResource = {
  navbar: {
    title: "Photo Bober",
  },
  photoUpload: {
    header: "WedPix",
    paragraph: `Dodaj więcej wspomnień!`,
    loadingSpinner: "Wysyłanie...",
    mediaSubmit: {
      videoButton: "Film",
      photoButton: "Zdjęcie",
      fromGalleryButton: "Dodaj z galerii",
      changeCameraButton: "Zmień kamerę",
      submitButtonPhoto: "Dodaj",
      submitButtonVideo: "Dodaj",
      compressionProgressVideo:
        "Przygotowywanie filmu (może chwilę potrwać)",
      compressionProgressPhoto: "Przygotowywanie zdjęcia",
      interruptCompressionText: "Jeśli chcesz przerwać, odśwież stronę",
      uploadProgressVideo: "Wysyłanie filmu",
      uploadProgressPhoto: "Wysyłanie zdjęcia",
      removePhotoButton: "Usuń",
      removeVideoButton: "Usuń",
      downloadFileButton: "Pobierz",
      successToastPhoto: "Twoje zdjęcie zostało wysłane!",
      successToastVideo: "Twój film został wysłany!",
      infoToastPhotoDeleted: "Zdjęcie usunięte pomyślnie",
      infoToastVideoDeleted: "Film usunięty pomyślnie",
      infoToastDownloadFile: "Rozpoczęto pobieranie",
      errorToast:
        "Coś poszło nie tak podczas wysyłania, spróbuj wysłać ponownie lub przyjdź po pomoc do Pana Młodego",
    },
  },
  toast: {
    success: "Udało się :)",
    info: "Info",
    warning: "Uwaga",
    error: "Wystąpił błąd",
  },
  videoRecorder: {
    addNewVideo: "Dodaj film!",
    repeatRecordingButton: "Nagraj ponownie",
    startRecordingButton: "Rozpocznij nagrywanie",
    stopRecordingButton: "Zakończ nagrywanie",
    switchCamera: "Zmień kamerę",
  },
};

export default translationPolish;
