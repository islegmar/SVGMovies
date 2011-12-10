<?php
include_once('config.php');

function genMovie($ext) {
    $file=MOVIE_DIR . '/peli.' . $ext;
    if ( file_exists($file) ) unlink($file);
    $args='-r 10 -i ' . IMG_DIR . '/img%d.png ' . $file;
    exec(FFMPEG_EXE . ' ' . $args);
    
    return $args;
}
echo ("Generando avi...");
$args = genMovie('avi');
echo ($args);

echo ("Generando mp4...");
$args = genMovie('mp4');
echo ($args);

// Esta es la única que parece funcio0nar con el tag <video> de HTML5 en FF
echo ("Generando ogv...");
$args = genMovie('ogv');
echo ($args);
?>