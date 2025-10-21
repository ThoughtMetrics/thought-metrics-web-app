import { cn } from '@/core/utils/cn';

const BG_COLORS: Record<string, string> = {
  default: 'bg-transparent',
  white: 'bg-white',
  'primary-light': 'bg-primary-light',
};

const CustomBoxIcon: React.FC<any> = ({ iconOptions }) => {
  return (
    <div
      className={cn(
        'w-12 h-12 rounded-md flex justify-center items-center p-2',
        iconOptions.isBorder ? 'border-black border-1' : '',
        iconOptions.isActive && BG_COLORS[iconOptions.bgColor],
        iconOptions.className
      )}
    >
      <iconOptions.icon className="w-full h-full" />
    </div>
  );
};

export default CustomBoxIcon;
