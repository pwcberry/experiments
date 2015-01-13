module.exports = function(grunt) {

    grunt.initConfig({
       connect: {
           port: 10000,
           base: 'dist',
           livereload: 10001
       }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('serve', ['connect']);

    grunt.registerTask('default', ['serve']);
};