/**
 * Query type module
 *
 * @packageDocumentation
 */
import { AtomName, Depth, KeyOfHardProperties, KeyOfCommonProperties, RealTypeOfAtomHardProperty, RealTypeOfAtomCommonProperty, RealTypeOfAtomProperty, KeyOfPropertyOfAtomDefinition } from './atom';
export declare type Query<A extends AtomName> = Query.Expression<A> | Query.Logical<A>;
export declare namespace Query {
    type QueryAtomKey<A extends AtomName> = KeyOfHardProperties | KeyOfCommonProperties | KeyOfPropertyOfAtomDefinition<A>;
    type QueryAtomRealType<A extends AtomName, P extends QueryAtomKey<A>> = P extends KeyOfHardProperties ? RealTypeOfAtomHardProperty<P> : P extends KeyOfCommonProperties ? RealTypeOfAtomCommonProperty<P> : P extends KeyOfPropertyOfAtomDefinition<A> ? RealTypeOfAtomProperty<A, P> : never;
    export type Equal<A extends AtomName> = {
        [P in QueryAtomKey<A>]?: QueryAtomRealType<A, P>;
    };
    type Comparsion<T> = {
        $eq?: T;
    } | {
        $gt?: T;
    } | {
        $gte?: T;
    } | {
        $in?: T[];
    } | {
        $lt?: T;
    } | {
        $lte?: T;
    } | {
        $ne?: T;
    } | {
        $nin?: T[];
    } | {
        $exists: boolean;
    };
    type WithComparsion<A extends AtomName> = {
        [P in QueryAtomKey<A>]?: Comparsion<QueryAtomRealType<A, P>>;
    };
    export type Expression<A extends AtomName> = Equal<A> | WithComparsion<A>;
    export type Logical<A extends AtomName> = {
        $and?: (Expression<A> | Logical<A>)[];
    } | {
        $not?: Expression<A> | Logical<A>;
    } | {
        $nor?: (Expression<A> | Logical<A>)[];
    } | {
        $or?: (Expression<A> | Logical<A>)[];
    };
    export type Options<A extends AtomName, D extends Depth = 0> = {
        depth?: D;
        sort?: string | Equal<A>;
        limit?: number;
        skip?: number;
        depth_query?: Query<A>;
    };
    export {};
}
