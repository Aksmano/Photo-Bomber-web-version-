interface PercentageProgressProps {
  percentage: string | number;
}

export const PercentageProgress = ({ percentage }: PercentageProgressProps) => {
  return (
    <div className="flex w-full align-items-center justify-content-center font-bold text-justify mt-1 text-2xl">
      {percentage}%
    </div>
  );
};
