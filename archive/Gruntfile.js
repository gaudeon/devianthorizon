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
                src: ['build/client.js', 'build/main.js'],
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
            main: {
                files: {
                    'build/main.js': ['client/src/main.js']
                },
                options: {
                  transform: [
                    ['hbsfy',{
                        extensions: ['html']
                    }]
                  ],
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
            'build/client.js': ['build/vendor.js', 'build/main.js']
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

        jshint: {
            options: {
                strict: false
            },
            all: ['Gruntfile.js', 'server.js', 'client/src/**/*.js', 'server/src/**/*.js', 'server/db/**/*.js', 't/**/*.js'],
            dev: ['client/src/**/*.js', 'server/src/**/*.js', 'server/db/**/*.js'],
            test: ['t/**/*.js']
        },

        simplemocha: {
            options: {
                globals: ['expect','sinon'],
                timeout: 3000,
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'tap'
            },

            server: {
                src: ['t/server/helper.js', 't/server/**/*.test.js']
            }
        },

        watch: {
            server: {
                files: ['server.js', 'server/**/*.js'],
                tasks: ['jshint:dev']
            },
            client: {
                files: ['client/src/**/*.js', 'client/templates/**/*.html'],
                tasks: ['clean:dev:src', 'browserify:main', 'jshint:dev', 'concat', 'copy:dev']
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
                    nodeArgs: ['--debug'],
                    watch: ['server.js', 'server/src', 'server/db', 'server/routes']
                }
            }
        },

        concurrent: {
            dev: {
                tasks: ['nodemon:dev', 'watch:server', 'watch:client', 'watch:sass'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    grunt.registerTask('init', ['clean', 'bower', 'browserify:vendor']);

    grunt.registerTask('dev', ['clean:dev', 'browserify:main', 'jshint:dev', 'sass', 'concat', 'copy:dev']);
    grunt.registerTask('prod', ['clean:prod', 'browserify:main', 'jshint:all', 'sass', 'concat', 'copy:prod', 'cssmin', 'uglify']);

    grunt.registerTask('dev:clean', 'clean:dev');
    grunt.registerTask('prod:clean', 'clean:prod');

    grunt.registerTask('server', ['dev', 'concurrent:dev']);
    grunt.registerTask('default', 'server');

    // testing tasks
    grunt.registerTask('server:test', 'simplemocha');
};
