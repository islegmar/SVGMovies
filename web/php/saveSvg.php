<?php
include_once('config.php');

try {

// Read parameters
$data=$_POST["image"];
$ind=$_POST["ind"];
$isPathChanged=$_POST["isPathChanged"];
$numFiles2Generate=$_POST["numFiles2Generate"];
$temblequeLevel=$_POST["temblequeLevel"];

$startInd=$ind;

$logger = Logger::getLogger("main");

for($i=$ind; $i<($ind+$numFiles2Generate); ++$i ) {
    $logger->info('START - saveSvg Se va a generar el fichero [base ' . $ind . ', numFiles2Generate : ' . $numFiles2Generate . '] : ' . $i . '.');
}


// Guanda el contenido en un fichero SVG
function storeInSvg($ind, $content, $temblequeLevel) {
	$logger = Logger::getLogger("main");
	
    // Añadimos tembleque a las imágenes, añadiendo un random translate()
	if (  $temblequeLevel!=0 ) {
		$offsetX = rand(0,$temblequeLevel);
		$offsetY = rand(0,$temblequeLevel);
	    $content = preg_replace('/transform=["\']([^"\']*)["\']/','transform="${1} translate(' . $offsetX . ',' . $offsetY . ')"', $content);
	}
	
	// Problemas con las URLs de las imágenes de Inkscape
	$content = str_replace(PATTERN_DIR_URL, PATTERN_DIR, $content);
	
	// Guardamos el fichero
    $svgFile=SVG_DIR . '/img' . $ind . '.svg';
    if ( file_exists($svgFile) ) unlink($svgFile); 
    $ret = file_put_contents($svgFile, $content);
    $logger->info($ind . ' - Guardado el fichero ' . $svgFile . '(ret : ' . $ret . ')'); 
    
    // Ya que estamos, generamos la imagen asociada
    svg2img($svgFile);
}

// Genera un PNG a partir de un SVG
function svg2img($svgFile) {
	$logger = Logger::getLogger("main");
	
	// Calculamos el path de la imagen
	// Usamos el nombre del fichero svg pero le cambiamos la extensión
	$imgFile=IMG_DIR . '/' . basename($svgFile,'.svg') . '.png';
	if ( file_exists($imgFile) ) unlink($imgFile);
	
	// Ejecutamos A SACO inkscape
	$cmd=INKSCAPE_EXE . ' -e ' . $imgFile . ' ' . $svgFile;
    // $cmd=CONVERT_EXE . ' ' . $svgFile . ' ' . $imgFile;
    //$cmd=JAVA_EXE . ' -jar I:/software/batik-1.7/batik-rasterizer.jar -bg 255.255.255.255 ' . $svgFile . ' -d ' . $imgFile;
    $ret = exec($cmd);
    
    $logger->info('svg2img - exec(' . $cmd . ') : ' . $ret);
}

if ( $isPathChanged==1 ) {
	// Si lo que guardamos es un path de una curva compuesta, guardaremos tantos
	// ficheros como tramos tenga la curva, para que el movimiento sea más suave
	// Lo que nos ha llegado es algo del tipo
	// <svg>
	//   <g>
	//     <path...../>
	//     <path...../>
	//     <path d="Mx,y Ca,b c,d e,f Ca,b c,d....." style="..."/>
	//   </g>
	// </svg>  
	// y lo que queremos es fragmentar el último <path> en 
	//   + <path d="Mx,y Ca,b c,d e,f" style="..."/>
	//   + <path d="Mx,y Ca,b c,d e,f Ca,b c,d" style="..."/>
	//   + ......
	// Para ir más rápido, usaremos strings en vez de parsear XML
	
	// 1.- Obtenemos el último elemento path
	$posLastTagPath=strrpos($data,'<path ');
	$posCloseTagGroup=strrpos($data,'</g>');
	$path=substr($data, $posLastTagPath, $posCloseTagGroup-$posLastTagPath);
	
	// 2.- Nos guardamos lo que hay antes y después del <path>, para poder reconstruir 
	// el XML del <svg>
	$xmlInicio=substr($data, 0, $posLastTagPath);
	$xmlFin=substr($data, $posCloseTagGroup);
	
	// 2.- Obtenemos el valor del atributo d
	preg_match('/.*d=[\'"]([^\'"]*)[\'"].*/', $path, $matches);
	$dAttr=$matches[1];
	
	// 3.- Lo troceamos en arcos
	$arcos=preg_split('/C/i', $dAttr);
	
	// Vamos a verificar que el número de arcos a generar coincide con los 
	// nos dicen
	if ( (sizeof($arcos)-1)!=$numFiles2Generate ) {
		throw new Exception('Nos han dicho de generar ' . $numFiles2Generate .
		' pero, según mis cálculos, voya a generar ' . sizeof($arcos) . 
		' (' . $dAttr . ')');
	} 
	
	// 4.- Generamos loe ficheros
	// El primer elemento es el M
	$newPathValue=$arcos[0];
	for($indP=1; $indP<sizeof($arcos); ++$indP) {
	  // El valor del path para este arco (lo que está dentro de la d="..."	
	  $newPathValue=$newPathValue . ' C' . $arcos[$indP];
	  // El correspondiente elemento <path>. Lo que hacemos es 
	  // cambiar del original el valor de d="..." por el nuevo, de este arco. 
	  // De esta manera no nos tenemos que preocupar de copiuar atributos y demás
	  $newPathEle = preg_replace('/(.*) d=[\'"][^\'"]*[\'"](.*)/','${1} d="' . $newPathValue . '" ${2}', $path);
	  
	  // Guardamos el SVG que es el que teníamos antes pero con el nuevo elemento 
	  // <path>
      storeInSvg($ind, $xmlInicio . $newPathEle . $xmlFin, $temblequeLevel);
	  
	  ++$ind;
	}
// Si no hemos cambiado el path, simplemento guardamos el svg	
} else {
	storeInSvg($ind, $data, $temblequeLevel);
}

$logger->info('END - saveSvg ind : ' . $ind);
echo json_encode(array('startInd' => $startInd,
                       'endInd'   => $ind));

} catch (Exception $e) {
    header('HTTP/1.1 500 Internal Server');
    header('Content-Type: application/json');
    die(json_encode($e->getMessage()));	
}
?>