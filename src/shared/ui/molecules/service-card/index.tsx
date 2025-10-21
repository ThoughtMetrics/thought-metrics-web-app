import { cn } from '@/core/utils/cn';
import CustomBoxIcon from '../../atoms/custom-box-icon';

const BG_COLORS: Record<string, string> = {
  default: 'bg-transparent',
  white: 'bg-white',
  primary: 'bg-primary',
  grey: 'bg-custom-grey-3',
};

const ServiceCard: React.FC<any> = ({
  service,
  index,
  className,
  iconClassName = '',
  contentClassName = '',
}) => {
  return (
    <div
      key={index + service.title}
      className={cn(
        'text-black rounded-lg flex flex-col',
        service.isBorder ? 'border-black border-1' : '',
        service.isActive && BG_COLORS[service.bgColor],
        className
      )}
    >
      {service.iconOptions && (
        <CustomBoxIcon iconOptions={service.iconOptions} />
      )}
      <div className={cn('flex flex-col gap-1 w-full', contentClassName)}>
        <span className="font-semibold wide:text-lg w-fit">
          {service.title}
        </span>
        {service.description && (
          <p className="wide:text-lg leading-5">{service.description}</p>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
