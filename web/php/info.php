<html> <head> <title>Test for ImageMagick</title> </head>
<body> 
<?php
class_exists('imagick');
get_loaded_extensions();
?>

<?php
/*
function alist ($array) {  //This function prints a text array as an html list.
  $alist = "<ul>";
  for ($i = 0; $i < sizeof($array); $i++) {
    $alist .= "<li>$array[$i]";
  }
  $alist .= "</ul>";
  return $alist;
}
exec("convert -version", $out, $rcode); //Try to get ImageMagick "convert" program version number.
echo "Version return code is $rcode <br>"; //Print the return code: 0 if OK, nonzero if error.
echo alist($out); //Print the output of "convert -version"
//Additional code discussed below goes here.
*/
?>

<?php
$svgFile = '/home/islegmar/public_html/data/test.svg';
$pngFile = '/home/islegmar/public_html/data/test.png';

//phpinfo();
echo $_SERVER['DOCUMENT_ROOT'] . '<br/>';
/*
$file = '/home/islegmar/public_html/data/test.txt';
if ( file_exists($file) ) unlink($file); 
$ret = file_put_contents($file, 'Fichero de prueba');
echo("file : $file => ret : $ret<br/>");
*/
/*
$img = imagecreatefrompng("image1.png"); 
$im = new Imagick();
$svgin = file_get_contents($svgFile);
echo("svgin : $svgin");
*/
$magick_wand=NewMagickWand();
MagickReadImage($magick_wand,$svgFile);
$drawing_wand=NewDrawingWand();
$pixel_wand=NewPixelWand();
PixelSetColor($pixel_wand,"red");
DrawSetFillColor($drawing_wand,$pixel_wand);
MagickEchoImageBlob( $magick_wand );
/*
$transparentColor = NewPixelWand()
PixelSetMagickColor(transparentColor, 'none')
MagickSetBackgroundColor(wand, transparentColor)

*/
?>