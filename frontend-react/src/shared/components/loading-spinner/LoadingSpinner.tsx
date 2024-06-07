import { ProgressSpinner } from "primereact/progressspinner";

interface LoadingSpinnerProps {
  text?: string;
}

export const LoadingSpinner = ({ text }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-column align-items-center justify-content-center">
      <ProgressSpinner strokeWidth="3" />
      {!!text && <div className="flex font-bold text-base">{text}</div>}
    </div>
  );
};
