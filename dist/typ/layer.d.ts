/**
 * Layer interfaces types module
 *
 * @packageDocumentation
 */
import { schema } from '../sch/server';
import { AccessLayer as ClientAccessLayer } from './layer_cln';
export interface AccessLayer<A extends schema.AtomName> extends ClientAccessLayer<A> {
}
