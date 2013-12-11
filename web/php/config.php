<?php
// Logger
require_once($_SERVER['DOCUMENT_ROOT'] . '/external/log4php/Logger.php');
Logger::configure(dirname(__FILE__) . '/config/log4php.php');


// Directorios varios
define("SVG_DIR"  ,$_SERVER['DOCUMENT_ROOT'] . '/svgmovies.data/svg');
define("IMG_DIR"  ,$_SERVER['DOCUMENT_ROOT'] . '/svgmovies.data/img');
define("MOVIE_DIR",$_SERVER['DOCUMENT_ROOT'] . '/svgmovies.data/movie');

// FIXME : HARD CODED URLS
define("PATTERN_DIR",'file:///I:/Proyectos/Dibujo2D/web/patterns/');
define("PATTERN_DIR_URL",'http://localhost/dibujo2D/patterns/');

// EXE
// TODO - Lo suyo es usar los módulos correspondientes de PHP (con ImageMagick
// sería suficiente), pero es mucho curro
define("INKSCAPE_EXE" , 'i:/software/Inkscape/inkscape.exe');
define("FFMPEG_EXE"   , 'i:/software/ImageMagick/ffmpeg.exe');
define("CONVERT_EXE"  , 'i:/software/ImageMagick/convert.exe');
define("JAVA_EXE"     , 'i:/WINDOWS/system32/java.exe');

// Crear los directorios (si fuese necesario)
if ( !file_exists(SVG_DIR)   ) mkdir ( SVG_DIR  , 0777 ,true);
if ( !file_exists(IMG_DIR)   ) mkdir ( IMG_DIR  , 0777 ,true);
if ( !file_exists(MOVIE_DIR) ) mkdir ( MOVIE_DIR, 0777 ,true);

?>