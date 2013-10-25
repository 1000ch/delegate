module.exports = (grunt) ->
  grunt.initConfig
    jshint:
      all: ["./src/delegate.js"]
    uglify:
      js:
        files:
          "./dist/delegate.min.js": ["./src/delegate.js"]
    watch:
      files: ["./src/delegate.js"],
      tasks: ["jshint", "uglify"]

  grunt.loadNpmTasks "grunt-contrib-jshint"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-watch"

  grunt.registerTask "default", "watch"
  grunt.registerTask "build", "uglify"