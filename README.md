## URANIO-CORE

Uranio CORE provides the (BLL) Business Logic Layer classes for an API service.

Uranio CORE can be extended to [Uranio API](https://github.com/nbl7/uranio-api)
for deploying a full webserice.

It can also be used for developing application that do not need a webservices,
like native Apps.

It has built-in (ACL) Access Control Layer classes and (DAL) Data Access Layer
classes.

For now it can interacts with [MongoDB](https://www.mongodb.com/) but more DB
will be available in the future.

### Atoms

In URANIO relation are called **Atom**. Uranio CORE provides default _Atoms_,
see section [Default Atoms](#default-atoms).

More _Atoms_ can be defined in the constant `atom_book` inside `src/book.ts`.
> See documentation for [book.ts]().

For example there can be a _Product Atom_.

The type of the object that represents the _Product Atom_ will be `Atom<'product'>`.

The type `Atom<T extends AtomName>` accepts as generic the type `AtomName`.

The type `AtomName` is the union of all the keys of the `atom_book` in `src/book.ts`.

For example if the `atom_book` is defined like so:
```typescript
export const atom_book:uranio.types.Book = {
	product:{
		...
	},
	order:{
		...
	}
}
```
type `AtomName` will be `'product' | 'order'`.

And `Atom` can be of type `Atom<'product'>` or `Atom<'order'>`;

#### Atom type definition

Following the example, the type `Atom<'product'>` will have the properties that
are defined in `atom_book`.

For example:
```typescript
export const atom_book:uranio.types.Book = {
	product:{
		properties:{
			title: {
				type: uranio.types.BookPropertyType.TEXT,
				label: 'Title'
			},
			price: {
				type: uranio.types.BookPropertyType.FLOAT,
				label: 'Price'
			},
		}
	}
}
```

It will make `Atom<'product'>` type:
```typescript
const product:Atom<'product'> = {
	_id: '61d81a12f3e4ea6edbdcdd1e',
	_date: '2022-01-07T10:46:42.584Z',
	title: 'Product title',
	price: 119.99
};
```

Type `Atom` **represents the type of the object stored in the database**. Therefore
it has, among the user defined properties, also the following ones:
- `_id`
- `_date`
- `_r` (optional) - Reading permission [see section [ACL](#access-control-layer)]
- `_w` (optional) - Writing permission [see section [ACL](#access-control-layer)]

### AtomShape

An `AtomShape` has only the user defined properties. So it will be like so:

```typescript
const product_shape:AtomShape<'product'> = {
	title: 'Product title',
	price: 119.99
};
```

This type is useful for insert a new _Atom_ in the database.


### Molecule

If an **Atom** has as parameter value another `Atom` is called **Molecule**.

`Molecule<A,D>` accept two generics. The first is the `AtomName`, the second is
how deep goes the object definition.

For example if the `atom_book` is defined like so:

```typescript
export const atom_book:uranio.types.Book = {
	customer: {
		...
	},
	product: {
		...
	},
	order:{
		properties:{
			...
			products: {
				type: uranio.types.BookPropertyType.ATOM_ARRAY,
				atom: 'product',
				label: 'Products'
			},
			customer: {
				type: uranio.types.BookPropertyType.ATOM,
				atom: 'customer',
				label: 'Customer'
			},
		}
	}
}
```

The type `Molecule<'order', 1>` will be:

```typescript
const product:Molecule<'order', 1> = {
	_id: '61dec7150529224d13ea7994',
	_date: '2022-01-12T12:18:29.617Z',
	products: [
		{
			title: 'Trousers',
			price: 119.99
		},
		{
			title: 'Shirt',
			price: 9.99
		}
	],
	customer: {
		first_name: 'John',
		email: 'john@email.com',
		...
	}
};
```

`Molecule<'order', 0>` is exactly like `Atom<'order'>`:

```typescript
const product:Molecule<'order', 0> = {
	_id: '61dec7150529224d13ea7994',
	_date: '2022-01-12T12:18:29.617Z',
	products: ['61dec7150529224d13ea7997', '61de9f518fb75c70ad33310a'],
	customer: '61dc3434a99090002c28cb4b'
};
```


### BLL

Uranio CORE provides BLL classes of the Atoms defined in the Book.

> See Book documentation [book.ts]()

```typescript
import uranio from 'uranio';

const products_bll = uranio.bll.create('product');
const product = await products_bll.find_by_id('61dec7150529224d13ea7997');
```

#### BLL Methods

The BLL provides the following methods to each realtion:

- `find`
- `find_by_id`
- `find_one`
- `count`
- `insert_new`
- `update_by_id`
- `update_one`
- `remove_by_id`
- `remove_one`
- `authorize`
- `upload` (available only for Atom `media`)

### Authentication

Uranio CORE provides a BLL for authentication:

```typescript
const auth_bll = uranio.bll.auth.create('superuser');
const token = await auth_bll.authenticate('email@email.com', '[PASSOWRD]');
```

`bll.auth.create` accept only `AuthAtom`.

The method `authenticate` returns a token that can be use for authorization.

```typescript
const passport = auth_bll.get_passort(token);
const products_bll = uranio.bll.create('product', passport);
const products = await products_bll.find({});
```


### Default Atoms

Uranio CORE provides the following relations:

- `superuser`
- `user`
- `group`
- `media`

> More relations can be added by developing [book.ts]()

##### Superuser

Superusers are user that bypass the ACL (Access Control Layer). They can interact with
the DB without authentication.

##### User

Users are entities that can interact with the DB after they have been authenticated.

##### Group

Each User can have multiple groups. The ACL (Access Control Layer) uses groups
to give permission to the user.

##### Media

The Media relation has an additional method `upload` for uploading files.

Uranio CORE can upload media to [AWS S3](https://aws.amazon.com/it/s3/).

> More platform will be adedd - i.e. Google Cloud Storage, Local, ...


### Access Control Layer

The Access Control Layer is an Access Layer that will check if it is possible
to make the query and filters the results with only the accessible data.

The permission on each Relation can be `UNIFORM` or `GRANULAR`.

Default is `UNIFORM`.

`UNIFORM` permission will check on a Relation level.

`GRANULAR` permission will check on a Record level.


In order to the ACL to work, it needs User and Group Relations.
Each request is made by an User. Each User has Groups.

Each Relation and each Record have two attributes `_r` and `_w`, respectively
for reading and writing permission. The value of these attributes is a
**Group ID Array**.

`_r` will _narrow_ from Everybody

`_w` will _widen_ from Nobody

`_r == nullish` -> Everybody can read

`_w == nullish` -> Nobody can write


### Database

Uranio CORE creates 3 connections to 3 different databases:

- `main`
- `log`
- `trash`

The `main` db is where all the realations are stored by default.

The `log` db is made for storing logs.

The `trash` db stores a copy of all deleted records.


### Developing Uranio CORE

As all Uranio repos, the only file that need to be develop is `src/book.ts`.

Here is the documenation on how to develop it:

(book.ts documentation)[]

