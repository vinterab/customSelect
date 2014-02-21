/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			src: {
				files: [{
					expand: true,
					flatten: true,
					src: ['src/<%= pkg.name %>.js'],
					dest: 'dist/'
				}]
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> */'
			},
			dist: {
				files: {
					'dist/<%= pkg.name %>.min.js': ['src/<%= pkg.name %>.js']
				},
				options: {
					sourceMap: 'dist/<%= pkg.name %>.min.map',
					sourceMappingURL: '<%= pkg.name %>.min.map',
					sourceMapPrefix: 1
				}
			}
		},
		jshint: {
			options: {
				jshintrc: true
			},
			main: ['src/*.js']
		},
		watch: {
			files: 'src/*.js',
			tasks: ['jshint', 'copy', 'uglify'],
			options: {
				spawn: false
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['jshint', 'copy', 'uglify']);

};
