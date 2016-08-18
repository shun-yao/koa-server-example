'use strict';

module.exports = {

	request: function *(next){

		this.api.response = 'test';
		yield next;
	},
	reply: function *(next){

		this.api.response = 'reply';
		yield next;
	}
}