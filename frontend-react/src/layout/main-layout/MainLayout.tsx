import { CSSProperties, Dispatch, SetStateAction, useState } from "react";
import "./MainLayout.css";
import { Outlet, useNavigate } from "react-router-dom";
import { PhotoUploadI18NKeys } from "../../utils/translation/domain/photo-upload/PhotoUploadI18N";
import { t } from "i18next";
import { createNestedKey } from "../../utils/stringUtils";
import { TranslationResourceKeys } from "../../utils/translation/domain/TranslationResource";

export type MainLayoutOutletContextType = {
  fileUrl: string;
  setFileUrl: Dispatch<SetStateAction<string>>;
  sendFile: boolean;
  setIfSendFile: Dispatch<SetStateAction<boolean>>;
};

export const MainLayout = () => {
  const navigate = useNavigate();
  const [fileUrl, setFileUrl] = useState<string>("");
  const [sendFile, setIfSendFile] = useState<boolean>(false);

  const getPageText = (key: PhotoUploadI18NKeys) =>
    t(createNestedKey(TranslationResourceKeys.PhotoUpload, key));

  return (
    <div className="h-full">
      <div className="main-layout-outlet_container">
        <div className="flex p-1 h-full flex-column gap-1 align-items-center justify-content-start">
          <div
            style={{ fontFamily: "A day without sun", fontSize: '8rem' }}
            className="flex text-center mt-7 cursor-pointer"
            onClick={() => navigate("sss")}
          >
            {getPageText(PhotoUploadI18NKeys.Header)}
          </div>
          <div className="flex text-justify mx-3 text-7xl">
            {getPageText(PhotoUploadI18NKeys.Paragraph)}
          </div>
          <Outlet
            context={
              {
                fileUrl,
                setFileUrl,
                sendFile,
                setIfSendFile,
              } satisfies MainLayoutOutletContextType
            }
          />
        </div>
      </div>
    </div>
  );
};
