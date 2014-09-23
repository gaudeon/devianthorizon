module.exports = function(grunt) {
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            client : ['client/requires'],
            public : ['public/css','public/img','public/js'],
            build  : 'build',
            dev    : {
                src: ['build/client.js', 'build/mud.js'],
                css: ['build/client.css', 'build/common.css']
            },
            prod   : 'dist'
        },

        bower: {
            install: {
                options: {
                    targetDir: 'client/requires',
                    layout: 'byComponent'
                }
            }
        },

        browserify: {
            vendor: {
                src: ['client/requires/**/*.js'],
                dest: 'build/vendor.js',
                options: {
                    transform: [ 'browserify-shim' ]
                }
            },
            mud: {
                files: {
                    'build/mud.js': ['client/src/mud.js']
                }
            }
        },


        sass: {
            build: {
                options: {
                    sourcemap: 'none'
                },
                files: {
                    'build/client.css': 'client/styles/main.scss'
                }
            }
        },

        concat: {
            'build/client.js': ['build/vendor.js', 'build/mud.js']
        },

        copy: {
            dev: {
                files: [
                    {
                        src  : 'build/client.js',
                        dest : 'public/js/client.js'
                    },
                    {
                        src  : 'build/client.css',
                        dest : 'public/css/client.css'
                    },
                    {
                        src  : 'client/img',
                        dest : 'public/img'
                    }
                ]
            },
            prod: {
                files: [
                    {
                        src  : 'client/img',
                        dest : 'dist/img'
                    }
                ]
            }
        },

        cssmin: {
            minify: {
                src: ['build/client.css'],
                dest: 'dist/css/client.css'
            }
        },

        uglify: {
            compile: {
                options: {
                    compress: true,
                    verbose: true
                },
                files: [{
                    src: 'build/client.js',
                    dest: 'dist/js/client.js'
                }]
            }
        },

        watch: {
            scripts: {
                files: ['client/src/**/*.js'],
                tasks: ['clean:dev:src', 'browserify:mud', 'concat', 'copy:dev']
            },
            sass: {
                files: ['client/styles/**/*.scss'],
                tasks: ['sass', 'copy:dev']
            },
        },

        nodemon: {
            dev: {
                script: 'bin/www',
                options: {
                    watch: ['server/src']
                }
            }
        },

        concurrent: {
            dev: {
                tasks: ['nodemon:dev', 'watch:scripts', 'watch:sass'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    grunt.registerTask('init', ['clean', 'bower', 'browserify:vendor']);

    grunt.registerTask('dev', ['clean:dev', 'browserify:mud', 'sass', 'concat', 'copy:dev']);
    grunt.registerTask('prod', ['clean:prod', 'browserify:mud', 'sass', 'concat', 'copy:prod', 'cssmin', 'uglify']);

    grunt.registerTask('dev:clean', 'clean:dev');
    grunt.registerTask('prod:clean', 'clean:prod');

    grunt.registerTask('server', ['dev', 'concurrent:dev']);
    grunt.registerTask('default', 'server');
};
