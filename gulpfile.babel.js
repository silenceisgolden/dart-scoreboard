import util from 'util';
import gulp from 'gulp';
import del from 'del';
import vulcan from 'gulp-vulcanize';
import browsersync from 'browser-sync';
let sync = browsersync.create();

import lists from './lists.json';

gulp.task( 'clean', cb => {
  del( lists.clean , cb);
});

gulp.task( 'libs', ['clean'], () => {
  return gulp.src( lists.libs )
    .pipe( gulp.dest( 'dist/lib' ));
});

gulp.task( 'copy', ['clean'], () => {
  return gulp.src( lists.copy )
    .pipe( gulp.dest( '' ));
});

gulp.task( 'elements', ['clean'], () => {
  return gulp.src( lists.elements )
    .pipe( vulcan( lists.opts.vulcan ) )
    .pipe( gulp.dest( 'dist' ))
    .on('error', err => {
      console.log( util.inspect( err ) );
    });
});

gulp.task( 'build', ['libs', 'copy', 'elements'] );
gulp.task( 'build-watch', ['build'], cb => {
  sync.reload();
  cb();
});

gulp.task( 'serve', ['build'], () => {
  sync.init({
    notify: false,
    server: './',
    open: false,
    snippetOptions: {
      rule: {
        match: '<span id="browser-sync-binding"></span>',
        fn: function( snippet ) {
          return snippet;
        }
      }
    }
  });
  gulp.watch( ['src/**/*', 'elements/**/*'], ['build-watch'] )
});

gulp.task( 'default', ['serve'] );
gulp.task( 'checkbuild', ['build'] );
