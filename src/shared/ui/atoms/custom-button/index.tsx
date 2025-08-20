import { cn } from '@/core/utils/cn';
import { Link } from 'react-router-dom';
type CustomButtonProps = {
  label: string;
  className?: string;
  path?: string;
};
const CustomButtonAtom: React.FC<CustomButtonProps> = ({
  label,
  className = '',
  path = '#',
}) => {
  return (
    <div className="w-full">
      <button
        className={cn(
          'bg-primary text-white font-bold rounded-md text-xl text-nowrap py-1 px-6 w-auto hover:bg-secondary hover:text-white transition-all duration-300 ease-in-out',
          className
        )}
      >
        <Link to={path} viewTransition={true}>
          <label>{label}</label>
        </Link>
      </button>
    </div>
  );
};

export default CustomButtonAtom;
