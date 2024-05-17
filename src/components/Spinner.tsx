import { ImSpinner8 } from 'react-icons/im';
type props = {
  classname?: string;
};

const Spinner = ({ classname }: props) => {
  return (
    <ImSpinner8
      size={30}
      className={`spinner ${classname}`}
      data-testid="spinner"
    />
  );
};

export default Spinner;
