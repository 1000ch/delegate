module.exports (grunt) ->
  grunt.initConfig
    jshint:
      all: ["./src/event-expander.js"]
    uglify:
      js:
        files:
          "./dist/event-expander.min.js": ["./src/event-expander.js"]
    watch:
      files: ["./src/event-expander.js"],
      tasks: ["jshint", "uglify"]

  grunt.loadNpmTasks "grunt-contrib-jshint"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-watch"

  grunt.registerTask "default", "watch"