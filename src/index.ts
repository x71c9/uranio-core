/**
 * Index module for URANIO Core
 *
 * @packageDocumentation
 */

// import mongoose from 'mongoose';

import * as urn_atms from './atms/';

// const mongoose_options = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
//   useCreateIndex: true
// };


// const uri = `mongodb://${process.env.urn_db_host}:${process.env.urn_db_port}/${process.env.urn_db_name}`;
// console.log(uri);
	
// const connection = mongoose.createConnection(uri, mongoose_options);
// const Model = connection.model('urn_users', urn_atms.user.module.schema);

// mongoose.connect(uri, mongoose_options);

// const personSchema = new mongoose.Schema({
//   name: String
// });


// const Model = mongoose.model('persons', personSchema);

import create_user_dal from './dal/users';

// import {urn_log} from 'urn-lib';

// import urn_mdls from 'urn-mdls';

// import * as urn_atms from './atom/';

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

const user = {
	_id:'5faa5acc1628f87526de20f4',
	first_name: 'Federico',
	last_name: 'Reale',
	email: `a@a${makeid(9)}.com`,
	username: `sakjd${makeid(9)}las`,
	password: 'skajdlsadlSSKLJ@à2',
	active: true,
	bio: 'S',
	type: 'pro',
	creation_date: new Date()
};

// // const model = new Model(user);

// // model.save(function(err:any){
// //   console.log(err);
// //   console.log('SAVED');
// // });


// const u = urn_atms.user.module.create(user);

// // // console.log(u);

// async function run(user:urn_atms.user.UserInstance){
	
//   try{
		
//     urn_log.debug('Running...');
		
//     const dal_users = create_user_dal();
		
//     // const ins_resp = await dal_users.insert_one(user);
		
//     // console.log('INS', ins_resp);

//     const find_res = await dal_users.find({});

//     console.log('FIND', find_res);
		
//   }catch(err){
		
//     console.log(err);
		
//   }
	
// }

// run(u);

const dal_users = create_user_dal('mongo');

// dal_users.find({}).then((data:any) => {
//   console.log('FIND', data);
// });

// dal_users.find_by_id('5faa5acc1628f87526de20f4').then((data:any) => {
//   console.log('FIND BY ID', data);
// });

// dal_users.find_one({_id:'5faa5acc1628f87526de20f4'},{sort: '-creation_date'}).then((data:any) => {
//   console.log('FIND ONE', data);
// });

dal_users.update_one(urn_atms.user.module.create(user)).then((data:any) => {
	console.log('UPDATE ONE', data);
});

