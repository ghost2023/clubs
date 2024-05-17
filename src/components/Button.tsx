import { cn } from '../lib/utils';
import Spinner from './Spinner';

type props = {
  label: string;
  isLoading?: boolean;
  disabled?: boolean;
} & React.ComponentProps<'button'>;

const Btn = ({ label, disabled, isLoading, className, ...rest }: props) => {
  return (
    <button
      {...rest}
      disabled={disabled || isLoading}
      className={cn(
        'flex justify-center items-center px-4 py-1 text-xs min-w-[140px] font-semibold tracking-widest text-white uppercase transition ease-in-out border-0 rounded-[18px] bg-primary disabled:bg-opacity-75 hover:brightness-110',
        className
      )}
    >
      {isLoading ? (
        <Spinner classname="self-stretch my-0.5" />
      ) : (
        <p className="my-2">{label}</p>
      )}
    </button>
  );
};

export default Btn;
