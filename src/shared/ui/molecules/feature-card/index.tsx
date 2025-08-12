import { cn } from '@/core/utils/cn';

const BG_COLORS: Record<string, string> = {
  default: 'bg-transparent',
  white: 'bg-white/20',
};

const FeatureCard: React.FC<any> = ({ feature, index, className }) => {
  return (
    <div
      key={index + feature.title}
      className={cn(
        'text-white rounded-lg flex flex-col gap-2 md:gap-8',
        feature.isBorder ? 'border-white border-1' : '',
        feature.bgColor && BG_COLORS[feature.bgColor],
        className
      )}
    >
      <div className="flex flex-col gap-4 md:gap-8 xxl:gap-10">
        <h2 className="text-base xxl:text-xl font-medium">{feature.title}</h2>
        <p className="text-md xxl:text-base font-normal leading-5">
          {feature.description}
        </p>
      </div>
    </div>
  );
};

const BrandAdFeatureCard: React.FC<any> = ({
  feature,
  index,
  className,
  contentClassName = '',
}) => {
  return (
    <div
      key={index + feature.title}
      className={cn(
        'text-white rounded-lg flex flex-col gap-1 md:gap-2 text-md md:text-base',
        feature.isBorder ? 'border-white border-1' : '',
        feature.bgColor && `${BG_COLORS[feature.bgColor]}`,
        className
      )}
    >
      {feature.sNo && (
        <div className="font-semibold">
          <span>{feature.sNo}</span>
        </div>
      )}
      <div
        className={cn(
          'flex flex-col gap-4 md:gap-8 xxl:gap-10',
          contentClassName
        )}
      >
        <h2 className="font-semibold">{feature.title}</h2>
        <p className="font-light leading-5">{feature.description}</p>
      </div>
    </div>
  );
};

const MarketOptFeatureCard: React.FC<any> = ({ feature, index, className }) => {
  return (
    <div
      key={index + feature.title}
      className={cn('w-full h-full bg-primary', className)}
    >
      <div
        className={cn(
          'w-full h-full flex text-white rounded-md font-semibold items-center justify-center text-center text-xs md:text-base p-1 md:px-2 md:py-4',
          feature.isBorder ? 'border-white border-1' : '',
          feature.bgColor && `${BG_COLORS[feature.bgColor]}`,
          'shadow-lg'
        )}
      >
        {feature.title}
      </div>
    </div>
  );
};

export { FeatureCard, BrandAdFeatureCard, MarketOptFeatureCard };
