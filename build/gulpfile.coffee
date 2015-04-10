###
#
# @date 2014-12-2 15:57:21
# @author pjg <iampjg@gmail.com>
# @link http://pjg.pw
# @version $Id$
###

gulp    = require 'gulp'
fs      = require 'fs'
path    = require 'path'
build   = require './lib/build'
config  = require './config'
gutil   = require 'gulp-util'
color   = gutil.colors
cp      = require 'child_process'
exec    = cp.exec
# git     = require 'gulp-git'

###
# Initialization program
###
gulp.task 'init', ->
    build.init()
    exec "gulp -T",(error, stdout, stderr)->
        console.log stdout
###
# clean files
###
gulp.task 'del.data', ->
    build.files.delJson()

gulp.task 'del.dist', ->
    build.files.delDistFiles()

###
# build sprite,less,css,js,tpl...
###
gulp.task 'build.jslib', -> 
    build.jsLibPaths()

gulp.task 'build.cfg', ->
    build.config()

gulp.task 'build.tpl', ->
    build.tpl2dev()

gulp.task 'build.js', ->
    build.js2dev()

gulp.task 'build.sp', ->
    build.sprite()

gulp.task 'build.less', ->
    build.less2css()

gulp.task 'build.bgmap', ->
    build.bgmap()

###
# push all files to dist
###
gulp.task 'css2dist', ->
    build.cssctl ->
        
gulp.task 'js2dist', ->
    build.jsctl ->
        gutil.log color.green 'JS pushed!'
gulp.task 'all2dist', ->
    # build.all2dist()
    build.cssctl()

###
# Injecting static files relative to PHP-tpl files
###
gulp.task 'html2dist', ->
    build.htmlctl()

###
# build bat tool
###
gulp.task 'tool', ->
    rootPath = path.join __dirname
    disk = rootPath.split('')[0]
    if disk != '/' 
        cmd = [disk + ':']
        cmd.push 'cd ' + rootPath
        cmd.push 'start gulp dev'
        fs.writeFileSync(path.join(__dirname,'..','startGulp.cmd'), cmd.join('\r\n'))
    else 
        sh = ['#!/bin/sh']
        shFile = path.join __dirname,'..','startGulp.sh'
        sh.push 'cd ' + __dirname
        sh.push 'gulp dev'
        fs.writeFileSync shFile, sh.join('\n')
        fs.chmodSync shFile, '0755'

gulp.task 'git', ->
    exec 'sh ./bin/autogit.sh',(error, stdout, stderr)->
        gutil.log stdout
        gutil.log stderr

###
# watch tasks
###
gulp.task 'watch', ->
    build.autowatch ->
        # clearTimeout _distTimer if _distTimer
        # _distTimer = setTimeout ->
        #     # build.all2dist ->
        #         # gulp.start ['git']
        # ,10000

###
# dev task
###
gulp.task 'default',[], ->
    build.sprite ->
        build.less2css ->
            build.jsLibPaths ->
                build.config ->
                    build.tpl2dev ->
                        build.js2dev ->
                            build.htmlctl()
                            setTimeout ->
                                gulp.start ['watch']
                            ,2000
###
# release
###
gulp.task 'release',['del.dist'], ->
    build.sprite ->
        build.less2css ->
            build.jsLibPaths ->
                build.tpl2dev ->
                    build.js2dev -> 
                        build.htmlctl()
                        setTimeout ->
                            gulp.start ['all2dist']
                        ,1000

