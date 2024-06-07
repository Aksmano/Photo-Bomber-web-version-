import { UploadStatus } from "../domain/UploadStatus";

export const useUploadStatus = (status: UploadStatus) => {
  const statusIdle = () => status === UploadStatus.Idle;
  const statusPending = () => status === UploadStatus.Pending;
  const statusSent = () => status === UploadStatus.Sent;
  const statusFailed = () => status === UploadStatus.Failed;

  return {
    statusIdle,
    statusPending,
    statusSent,
    statusFailed,
  };
};
