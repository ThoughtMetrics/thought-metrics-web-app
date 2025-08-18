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
      <Link
        to={path}
        viewTransition={true}
        className={cn(
          'bg-primary text-white font-bold rounded-md text-xl text-nowrap py-1 px-6 w-auto hover:bg-custom-blue hover:text-white',
          className
        )}
      >
        <label>{label}</label>
      </Link>
    </div>
  );
};

export default CustomButtonAtom;
