/**
 * Shared type module
 *
 * @packageDocumentation
 */

export * from './typ/atom_config';

export type DatabaseType = 'mongo'; // | 'mysql'

export type RelationName = 'urn_user'; // | 'urn_media';

export type Configuration = {
	
	db_type: DatabaseType;
	
	db_host: string;
	
	db_port: number;
	
	db_name: string;
	
	db_trash_name: string;
	
	db_log_name: string;
	
	jwt_private_key: string;
	
}

type KeysOfType<T> = {
	
	[P in keyof T]?: any;
	
}

export type QueryOptions<T> = {
	
	sort?: string | KeysOfType<T>;
	
	limit?: number;
	
	skip?: number;
	
}

type FilterLogicType<M> = {
	
	$and?: KeysOfType<M>[],
	
	$or?: KeysOfType<M>[],
	
	$nor?: KeysOfType<M>[],
	
	$not?: KeysOfType<M>[]
	
};

export type FilterType<T> = KeysOfType<T> & FilterLogicType<T>;



const real = {
	product: {
		properties: {
			title: {
				type: 'string'
			}
		}
	}
};

const config = {
	...real,
	user: {
		properties: {
			first_name: {
				type: ''
			},
			last_name: {
				type: ''
			}
		}
	}
};

type AtomNames = keyof typeof config;

export interface Atom {
	_id:string
}

//interface User extends Atom {
//    first_name:string
//}

//type Query<T> = {
//    [k in keyof T]?: string
//}

// class DAL<A extends AtomNames> {
//   find(p:Query<A>):A{
//     console.log(p);
//     return {_id: ''} as unknown as A;
//   }
// }

type PropOfAtom<T extends AtomNames> = typeof config[T]['properties'];

// const k:PropOfAtom<AtomNames.USER> = ;

//const p:Query<PropOfAtom<AtomNames.USER>> = {first_name: ''}

export type Query<T extends AtomNames> = Partial<Record<keyof PropOfAtom<T>, string>>;

// const p1:Query<'user'> = {first_ename: ''};
// const p2:Query<'user'> = {last_name: '', first_name: '', ii: ''};


// const dal = new DAL<'user'>();

// new DAL<'producyt'>();

// const user = dal.find({first_nawme:''}):


//const enum AtomNames {
//    USER = 'user'
//}

type AtomProperty = {
    readonly type: string
}

type AtomProperties = {
    readonly [k:string]: AtomProperty
}

type AtomDefinition = {
    readonly properties: AtomProperties
}

export type AtomConfig = {
    readonly [k in AtomNames]: AtomDefinition
    //readonly [k:string]: AtomDefinition
}

//function use(ad:AtomDefinition):void{
//}


//function create_atom_definition(name:string, ad:AtomDefinition):AtomDefinition{
//    return ad;
//}

//const atom:AtomDefinition = create_atom_definition('user', {
//
//})

//use(atom);



//const config = {
//    user: {
//        properties: [
//            {name: "email", type: "text"},
//            {name: "title", type: "text"},
//        ]
//    },
//    product: {
//        properties: [
//            {name: "email", type: "text"},
//            {name: "title", type: "text"},
//        ]
//    }
//} as const;

//type A<T extends AtomNames> = (typeof config[T]['properties'])[number]['name'];

//const gg:A<AtomNames.USER> = '';



//type f<T extends keyof typeof config> = keyof typeof config[T]['properties'];

//const gg:f<AtomNames.USER> = 'name';
//const gf:f<AtomNames.USER> = '';


//type AtomNames = InferKeyFromObject<typeof config>;

//declare function check_config(a:AtomConfig):void;
//check_config(config);

//const clone = Object.assign(config);

//type InferKeyFromObject<U> = ((k: U) => void) extends ((k: infer I) => void) 
//    ? keyof I : never

//type PropertiesFromAtomName<T extends AtomNames> = 
//    InferKeyFromObject<typeof config[T]['properties']>;

//const t:PropertiesFromAtomName<'superuser'> = 'email';

//const t:PropertiesFromAtomName<AtomNames.USER> = 'name';
//const p:PropertiesFromAtomName<AtomNames.PRODUCT> = 'title';

//const s:PropertiesFromAtomName<AtomNames.PRODUCT> = '';

//const t:PropertiesFromAtomName<'user'> = 'name';
//const p:PropertiesFromAtomName<'product'> = 'title';

//const s:PropertiesFromAtomName<'product'> = '';


//type Arg = { 
//  properties: AtomProperties
//};

//const myArgs = { 
//    properties: {
//        firstName: '',
//        lastName: ''
//    }
//} as const;

// type Distribute<U extends Arg> = U extends Arg ? keyof U["properties"] : never;

//type UnionToIntersection<U> = ((k: U) => void) extends ((k: infer I) => void) ? keyof I : never

//type X = UnionToIntersection<typeof myArgs['properties']>;

//let x: X = 'firstName';
//let y: X = 'lastName';
//let z: X = 'ladstName';

// const enum AtomNames {
//   USER = 'user',
//   PRODUCT = 'product'
// }

// type AtomProperty = {
//     type: string
// }

// type AtomProperties = {
//     [k:string]: AtomProperty
// }

// type AtomDefinition = {
//    properties: AtomProperties
// }

// type AtomConfig = {
//     [k in AtomNames]: AtomDefinition
// }

// const config = {
//   user: {
//     properties: {
//       name: {
//         type:'text'
//       }
//     }
//   },
//   product: {
//     properties: {
//       title: {
//         type:'number'
//       }
//     }
//   }
// } as const;

// type InferKeyFromObject<U> = ((k: U) => void) extends ((k: infer I) => void) 
//     ? keyof I : never

// type PropertiesFromAtom<T extends AtomNames> = 
//     InferKeyFromObject<typeof config[T]['properties']>;

// const t:PropertiesFromAtom<AtomNames.USER> = 'name';
// const p:PropertiesFromAtom<AtomNames.USER> = '';



