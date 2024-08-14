import { FileData } from "@ffmpeg/ffmpeg/dist/esm/types";
import { IndexedDBUtils } from "../../../utils/indexedDBUtils";
import {
  IDBMediaFileBinaryData,
  IDBMediaFileBinaryDataKeys,
} from "./useMediaFileCompress";
import { UploadType } from "../domain/UploadType";

export const useIndexedDBMediaFile = () => {
  const getMediaFileBinaryData = async (): Promise<IDBMediaFileBinaryData> => {
    const data = await IndexedDBUtils.getItem<FileData>(
      IDBMediaFileBinaryDataKeys.Data
    );
    const type = await IndexedDBUtils.getItem<UploadType>(
      IDBMediaFileBinaryDataKeys.Type
    );

    return {
      data,
      type,
    };
  };

  const addMediaFileBinaryData = async ({
    data,
    type,
  }: IDBMediaFileBinaryData): Promise<void> => {
    await IndexedDBUtils.addItem(IDBMediaFileBinaryDataKeys.Data, data);
    await IndexedDBUtils.addItem(IDBMediaFileBinaryDataKeys.Type, type);
  };

  const deleteMediaFileBinaryData = async (): Promise<void> => {
    await IndexedDBUtils.deleteItem(IDBMediaFileBinaryDataKeys.Data);
    await IndexedDBUtils.deleteItem(IDBMediaFileBinaryDataKeys.Type);
  };

  return {
    getMediaFileBinaryData,
    addMediaFileBinaryData,
    deleteMediaFileBinaryData,
  };
};
