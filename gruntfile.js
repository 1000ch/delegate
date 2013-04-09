module.exports = function(grunt) {
	grunt.initConfig({
		jshint: {
			all: ["./handle.js"]
		},
		uglify: {
			js: {
				files: {
					"./handle.min.js": ["./handle.js"]
				}
			}
		},
		qunit: {
			all: ["test/*.html"]
		},
		watch: {
			files: ["handle.js"],
			tasks: ["jshint", "uglify", "qunit"]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask("default", "watch");
};
