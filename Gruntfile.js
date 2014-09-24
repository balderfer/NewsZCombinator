module.exports = function(grunt) {
    grunt.initConfig({
        sass: {
            dist: {
                options: {
                    includePaths: require('node-neat').with('sass', 'public/stylesheets')
                },
                files: {
                    'public/stylesheets/base.css': 'sass/base.scss'
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 3 versions', '> 5%', 'ie 8', 'ie 7', 'ie 9']
            },
            dist: {
                files: {
                    'public/stylesheets/base.css': 'public/stylesheets/base.css'
                }
            }

        },
        cssmin: {
            combine: {
                files: {
                    'public/stylesheets/base.min.css': 'public/stylesheets/base.css'
                }
            }
        },
        watch: {
            source: {
                files: ['sass/**/*.scss', 'views/**/*.jade'],
                tasks: ['sass', 'autoprefixer', 'cssmin'],
                options: {
                    livereload: true, // needed to run LiveReload
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['sass']);
};