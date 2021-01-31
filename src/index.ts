/**
 * Index module for URANIO Core
 *
 * @packageDocumentation
 */

import * as urn_core from './_core/main';

export default urn_core;

const bll = urn_core.bll.create_basic('superuser');

bll.find({}).then((d) => console.log(d));
