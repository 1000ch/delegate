module.exports = function(grunt) {
	grunt.initConfig({
		qunit: {
			all: ["test/*.html"]
		},
		watch: {
			files: ["handle.js"],
			tasks: ["qunit"]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask("default", "watch");
};
