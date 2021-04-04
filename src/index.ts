
import {urn_log} from 'urn-lib';

import uranio from 'uranio';

urn_log.defaults.log_level = urn_log.LogLevel.FUNCTION_DEBUG;

const su = uranio.bll.basic.create('superuser');
su.find({}).then(d => console.log(d));
