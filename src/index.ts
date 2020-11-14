/**
 * Index module for URANIO Core
 *
 * @packageDocumentation
 */

// import {urn_log} from 'urn-lib';

// urn_log.defaults.log_level = urn_log.LogLevel.FUNCTION_DEBUG;

import * as urn_atm from './atm/';

import create_user_dal from './dal/users';

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
	// _id:'5fad2102bcfacd4ea51dc9ae',
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

// const user2 = {
//   _id:'5fad2102bcfacd4ea51dc9ae',
//   first_name: 'Federico',
//   last_name: 'Reale',
//   email: `a@a${makeid(9)}.com`,
//   username: `sakjd${makeid(9)}las`,
//   password: 'skajdlsadlSSKLJ@à2',
//   active: true,
//   bio: 'S',
//   type: 'pro',
//   creation_date: new Date()
// };

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

// dal_users.insert_one(urn_atm.user.module.create(user2)).then((data:urn_atm.user.UserInstance | null) => {
//   console.log('INSERT ONE1', data);
// });

dal_users.insert_one(urn_atm.user.module.create(user)).then((data:urn_atm.user.UserInstance | null) => {
	// console.log('INSERT ONE2', data);
	if(data !== null){
		// dal_users.delete_one(data);
		dal_users.delete_one(data).then((data:urn_atm.user.UserInstance | null) => {
			console.log('DELETE ONE2', data);
		});
	}
});

// dal_users.update_one(urn_atm.user.module.create(user)).then((data:any) => {
//   console.log('UPDATE ONE', data);
// });

// dal_users.delete_one(urn_atm.user.module.create(user)).then((data:any) => {
//   console.log('DELETE ONE', data);
// });
