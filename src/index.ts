/**
 * Index module for URANIO Core
 *
 * @packageDocumentation
 */

// console.log(process.env.urn_env_name);

import create from './dal/users';

import {urn_log} from 'urn-lib';

// urn_log.defaults.log_level = urn_log.LogLevel.FUNCTION_DEBUG;

async function run(){
	
	urn_log.debug('Running...');
	
	const dal_users = create();
	
	// await dal_users.insert_one();
	
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
