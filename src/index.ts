// export namespace models {
//   export type User = urn_mdls.resources.User;
// }

/**
 * Index module for URANIO Core
 *
 * @packageDocumentation
 */

// console.log(process.env.urn_env_name);

import create from './dal/users';

import {urn_log} from 'urn-lib';

import urn_mdls from 'urn-mdls';

// import * as urn_atom from './atom/';

// urn_log.defaults.log_level = urn_log.LogLevel.FUNCTION_DEBUG;

function makeid(length:number) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for ( let i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

import * as urn_atom from './atom/';


const user:urn_mdls.resources.User = {
	first_name: 'Federico',
	last_name: 'Reale',
	password: 'useFindsAndModifydkjdasldkjasl',
	email: `feddswdddd@dndr4e.net${makeid(20)}`,
	username: `ddddkddsla${makeid(20)}`,
	active: true,
	type: 'pro',
	bio: 'BIO',
	creation_date: new Date()
};

const user_keys:string[] = [];

const uuu = urn_atom.user.module.create(user);


// console.log(uuu._get_keys());

console.log(uuu);

console.log(Object.keys(uuu));

console.log(user_keys);

async function run(){
	
	urn_log.debug('Running...');
	
	const dal_users = create();
	
	// const user:urn_mdls.resources.User = {
	//   first_name: 'Federico',
	//   last_name: 'Reale',
	//   password: 'useFindsAndModifydkjdasldkjasl',
	//   email: `feddswdddd@dndr4e.net${makeid(20)}`,
	//   username: `ddddkddsla${makeid(20)}`,
	//   active: true,
	//   type: 'pro',
	//   bio: 'BIO',
	//   creation_date: new Date()
	// };


	// const uuu = urn_atom.user.module.create(user);

	// const uset_ke

	// console.log(uuu);

	// console.log(user);
	
	// const ins = await dal_users.insert_one(urn_atom.user.create(user));
	
	// console.log(ins);
	
	const resp = await dal_users.find({});
	
	console.log(resp);
}

run();

// import {urn_connection} from './db';

// try{
	
//   const connection = urn_connection.create_instance('con_name', 'localhost', 3000, 'dbname');
//   console.log(connection);
	
// }catch(err){
	
//   // console.log(err);
	
// }

// import create_instance from './rsrc/user';
// const b = {
//   _id:'sdjhaskhdjkas',
//   email:'a@a.com',
//   username:'usernmae',
//   malicious:'HDNSKJ(")/)',
//   first_name:'',
//   last_name:'',
//   active:true,
//   password:'',
//   bio:'',
//   type:''
// };
// const a = create_instance(b);
// // a.vali();
// console.log(a);


// interface inter {
	
//   a:string
//   b:number
	
// }

// class A implements inter{
//   private c:string;
//   constructor(public a:string, public b:number){
//     this.c = this.a + this.b;
//   }
//   public console(){
//     console.log(this.c);
//   }
// }

// console.log(Object.keys(new A()));

// for(const k in Object.entries(A)){
//   console.log(k);
// }
//
//
// https://www.typescriptlang.org/play?#code/JYOwLgpgTgZghgYwgAgApyhcBZA9gEwgBtkBvAWAChkbkB9YfALmQGcwpQBzKgXyqqhIsRCgDCAC2BF8eQiQgAPSCHys0GLGDnEyVWshjAo7OiDgBbCE3acQPSv0pUwATwAOKAMq4rAaQhXVgB5GAAeABUAPmQAXmQvCDAwgGtA3BhkaIBuAUo4ACNbRDBkBCI4VnV0THAw7GQlFTUNWu0CYhjgC3ciCCtwas0cDpIKZ2padwBXAqJgBHpGGw5uXImDBFwQW2mEMFwoAApMVlxpqCQmbAAaZBm5heRT88uIOjSgph9-QJDw7BRACU4wMBjAUlYADoGPg4s8IGcLkgYYx1gYnPoprN5osDnRWN1eu9cAUAFYQfZHIHXPSTMFlbbsNhEvp0Ulk+GkXjISrIbDohmGQ5HLY7UopZAZZAQ4DQl7I96fVggrFC2iEnpsjkAbRSAF14bLWHr9dlkGqwU4hZgwBcQCytSTyYKaJjHHkxczpqxoB8-t9fBAAkFQmFJNJZKMYvEQBAAO4JJJHHUAciMJjAZksEFTN1TsNT+qB6yo5Uq6gjMkayiwLRqWnDUhkOiIXSdAzAlebUfkdMtD1xhmMpnMVhWdgclq9HD2B2OoGAYCYVd7xFV9LBrGmngXICXdx9fuVJct4MhUIzo5z8MXYEvI6zY4gruQ7vdM7KPfhccTq6OpCwkwqYAIx5sOmbZuOyCpgAUrgEggKmvCnhMXq4H0UJELgXCij2UL4pqxLsuSlJgNSJbIAA9FRyAAJKlKwEjnNWtr2mQQHICBdxXk+OYsHBCFIbwQA
