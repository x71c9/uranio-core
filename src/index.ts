/**
 * Index module for URANIO Core
 *
 * @packageDocumentation
 */

// import {urn_connection} from './db';

// try{
	
//   const connection = urn_connection.create_instance('con_name', 'localhost', 3000, 'dbname');
//   console.log(connection);
	
// }catch(err){
	
//   // console.log(err);
	
// }

import create_instance from './rsrc/user';
const b = {email:'a@a.com',username:'usernmae',malicious:'HDNSKJ(")/)'};
const a = create_instance(b);

console.log(a);


