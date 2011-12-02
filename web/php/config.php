<?php
// Logger
include_once('./common/log4php/Logger.php');
// No log
//Logger::configure($_SERVER['DOCUMENT_ROOT'] . "/php/config/logger.xml"  );
// Log in file
Logger::configure('./config/log4php.properties');
//Logger::configure($_SERVER['DOCUMENT_ROOT'] . "/php/config/log4phpNull.properties"  );
//$logger = Logger::getLogger("main");


// Directorios varios
define("SVG_DIR"  ,'../data/svg');
define("IMG_DIR"  ,'../data/img');
define("MOVIE_DIR",'../data/movie');
define("PATTERN_DIR",'file:///I:/Proyectos/Dibujo2D/web/patterns/');
// TODO - La URL de este directorio se debería obtener de otra manera
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