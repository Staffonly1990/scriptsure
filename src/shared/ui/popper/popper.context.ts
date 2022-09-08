import { createContext } from 'react';
import { noop } from 'lodash';

const PopperContext = createContext({ dismiss: noop });

export default PopperContext;
