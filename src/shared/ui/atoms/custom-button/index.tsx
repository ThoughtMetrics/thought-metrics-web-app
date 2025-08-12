import { cn } from '@/core/utils/cn';
type CustomButtonProps = {
  label: string;
  className?: string;
};
const CustomButtonAtom: React.FC<CustomButtonProps> = ({
  label,
  className = '',
}) => {
  return (
    <div className="w-full">
      <button
        className={cn(
          'bg-primary text-white font-bold rounded-md text-xl text-nowrap py-1 px-6 w-auto',
          className
        )}
      >
        <label>{label}</label>
      </button>
    </div>
  );
};

export default CustomButtonAtom;
