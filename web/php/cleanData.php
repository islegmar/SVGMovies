<?php
include_once('config.php');
include_once('util.php');

// Limpieza de directorios y demás
deleteDir(SVG_DIR, false);
deleteDir(IMG_DIR, false);
deleteDir(MOVIE_DIR, false);
deleteDir('I:/var/www/dibujo2D/logs', false);

?>