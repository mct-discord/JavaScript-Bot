const fetch = require('node-fetch');
const parseLinkHeader = require('parse-link-header');

module.exports = {
	name: 'canvas_api_functions',
	description: 'Canvas Api Functions',
	async getCourses(canvas_access_token) {
		const courses = [];
		let next_url = 'https://leho-howest.instructure.com/api/v1/courses';
		while (next_url !== undefined) {
			await fetch(next_url, {
				headers: {
					'Authorization': 'Bearer ' + canvas_access_token,
				},
			})
				.then(response => {
					const next = parseLinkHeader(response.headers.get('Link')).next;
					if (next) {
						next_url = next.url;
					}
					else {
						next_url = undefined;
					}
					return response.json();
				})
				.then(json => {
					for (let i = 0; i < json.length; i++) {
						courses.push(json[i].name);
					}
				});
		}
		return courses;
	},
	async getFavorites(canvas_access_token) {
		const favorites = [];
		await fetch('https://leho-howest.instructure.com/api/v1/users/self/favorites/courses', {
			headers: {
				'Authorization': 'Bearer ' + canvas_access_token,
			},
		})
			.then(response => response.json())
			.then(json => {
				for (let i = 0; i < json.length; i++) {
					favorites.push(json[i].name);
				}
			});
		return favorites;
	},
	async getUser(canvas_access_token) {
		let user = '';
		await fetch('https://leho-howest.instructure.com/api/v1/users/self', {
			headers: {
				'Authorization': 'Bearer ' + canvas_access_token,
			},
		})
			.then(response => response.json())
			.then(json => {
				const name_parts = json.name.split(' ');
				for (let i = 0; i < name_parts.length; i++) {
					name_parts[i] = name_parts[i].charAt(0).toUpperCase() + name_parts[i].slice(1).toLowerCase();
				}
				json.name = name_parts.join(' ');
				user = json;
			});
		return user;
	},
};