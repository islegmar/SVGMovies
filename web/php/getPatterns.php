<?php
// Devuelve todas las patterns registradas en el servidor
include_once('config.php');
/*
$path = $_SERVER['SERVER_NAME'] . $_SERVER['PHP_SELF'];
$path = str_replace($_SERVER['DOCUMENT_ROOT'], '', $path);
echo ($path . '<br/>');

echo($_SERVER['SERVER_NAME'] . '<br/>');
echo($_SERVER['PHP_SELF'] . '<br/>');
echo($_SERVER['DOCUMENT_ROOT'] . '<br/>');
*/
// Leemos el contenido del directorio (no subdirectorios)
if ($handle = opendir(PATTERN_DIR)) {
    while (false !== ($file = readdir($handle))) {
        if ( $file!="." && $file!=".." && !is_dir($file) ) { 
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if ( $ext=="jpg" || $ext=="png" ) {	
                // Calculamos la url de este fichero
                $url = PATTERN_DIR_URL . $file;
                $file = PATTERN_DIR . '/' . $file;
                $patterns[basename($file)] = array( 'url' => $url, 'file'=>$file);
           }
        }
    }
    closedir($handle);
}

// Devolvemos el valor
echo json_encode($patterns);
?>