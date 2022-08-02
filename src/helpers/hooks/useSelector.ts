import { AppType } from '@redux/store';
import { useSelector as useSelectorFromRedux } from 'react-redux';

const useSelector = <T>(selector: (state: AppType) => T): T => {
    return useSelectorFromRedux(selector);
};

export default useSelector;
