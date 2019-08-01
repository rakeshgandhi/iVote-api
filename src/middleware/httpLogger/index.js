import morgan from 'morgan';
import { logger } from '../../utils/logger';

export default morgan(':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"', { stream: logger.stream });