import { ProgressSpinner } from "primereact/progressspinner";

interface LoadingSpinnerProps {
  text?: string;
  textClassNames?: string;
}

export const LoadingSpinner = ({
  text,
  textClassNames,
}: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-column align-items-center text-center justify-content-center">
      <ProgressSpinner strokeWidth="3" />
      {!!text && (
        <div
          className={`flex font-bold mb-3 text-lg ${textClassNames ?? ""}`}
        >
          {text}
        </div>
      )}
    </div>
  );
};
