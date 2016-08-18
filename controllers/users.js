'use strict';

module.exports = {

	login: function *(next){

		this.api.response = 'login';
		yield next;
	},
	register: function *(next){

		this.api.response = 'register';
		yield next;
	}
}