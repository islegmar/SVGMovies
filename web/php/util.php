<?php
/** Borra de manera recursiva los ficheros */
function deleteDir($dir, $deleteDirectory) {
    foreach (scandir($dir) as $item) {
        if ($item == '.' || $item == '..' ) continue;
        $file=$dir.DIRECTORY_SEPARATOR.$item;
        if ( is_dir($file) ) {
        	deleteDir($file, $deleteDirectory);
        } else {
            unlink($file);
        }
    }
    if ( $deleteDirectory ) {
        rmdir($dir);
    }
}
?>