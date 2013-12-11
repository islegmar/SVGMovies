<div id="paintBox">
	<button type="button" class="bClose"></button>
  <div class="WidgetPaintTool toolWidgetPaintMode">
    <form>
      <!--
	        <b>Modo de dibujo</b><br/>
	        Full color : <input type="radio" name="paintMode" value="color"/><br/>
	        B&W: <input type="radio" name="paintMode" value="b&w" checked/><br/>
	        -->
      <table border="1" class="advancedOnly">
        <tr>
          <td class="tHeader">&nbsp;</td>
          <td class="tHeader">Current Step</td>
          <td class="tHeader">New Step</td>
        </tr>
        <tr>
          <td class="tHeader">Fotograma Actual</td>
          <td><input type="radio" name="actionWhenMouseReleased" value="1" />
          </td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="tHeader">Un nuevo Fotograma (aparece de golpe)</td>
          <td><input type="radio" name="actionWhenMouseReleased" value="3" />
          </td>
          <td><input type="radio" name="actionWhenMouseReleased" value="2" />
          </td>
        </tr>
        <tr>
          <td class="tHeader">Varios nuevos Fotogramas (trazos)</td>
          <td><input type="radio" name="actionWhenMouseReleased" value="5" />
          </td>
          <td><input type="radio" name="actionWhenMouseReleased" value="4"
            checked />
          </td>
        </tr>
      </table>
      <table class="advancedOnly">
        <tr>
          <td>Zoom crea fotogramas</td>
          <td><input id="zoomCreaFotogramas" type="checkbox" checked/>
          </td>
        </tr>
        <tr>
          <td>Move crea fotogramas</td>
          <td><input id="moveCreaFotogramas" type="checkbox" checked/>
          </td>
        </tr>
        <tr>
          <td>Stroke-with constante con zoom</td>
          <td><input id="zoomChangeStrokeWidth" type="checkbox" checked />
          </td>
        </tr>
      </table>
    </form>
  </div>
  <table class="WidgetPaintTool toolWidgetToolLinea">
    <!-- Pincel -->
    <tr class=" advancedOnly">
      <td>Num Puntos saltar</td>
      <td><input id="numPuntosSaltar" type="number" min="1" max="10" size="5" />
      </td>
    </tr>
    <tr class="advancedOnly">
      <td>Suavizar Caminos</td>
      <td><input id="suavizarCamino" type="checkbox" />
      </td>
    </tr>
    <!-- Grosor Pincel -->
    <tr class="WidgetPaintTool toolWidgetPaintBrush">
      <td>Grosor Pincel</td>
      <td><input id="grosorPincel" type="number" min="1" max="10" size="5" />
      </td>
    </tr>
    <!--  Nivel de tembleque  -->
    <tr class="WidgetPaintTool toolWidgetPaintTembleque advancedOnly">
      <td>Tembleque</td>
      <td><input type="number" min="1" max="10" size="5" />
      </td>
    </tr>
  </table>
  <div class="toolWidgetLineaRelleno">
 		<span class="cbLineWhite selected" data-color='{ "line" : "#FFFFFF" , "fill" : "none"}'></span>
    <span class="cbLineBlack"          data-color='{ "line" : "#000000" , "fill" : "none"}'></span>
 		<span class="cbLineRed"            data-color='{ "line" : "red" ,     "fill" : "none"}'></span>
    
    <span class="cbWhiteBlack"          data-color='{ "line" : "#FFFFFF" , "fill" : "#000000"}'></span>
 		<span class="cbWhiteRed"            data-color='{ "line" : "#FFFFFF" , "fill" : "red"}'></span>
 		
 		<span class="cbBlackWhite"          data-color='{ "line" : "#000000" , "fill" : "#FFFFFF"}'></span>
 		<span class="cbBlackRed"            data-color='{ "line" : "#000000" , "fill" : "red"}'></span>
 		
 		<span class="cbRedWhite"            data-color='{ "line" : "red"     , "fill" : "#FFFFFF"}'></span>
 		<span class="cbRedBlack"            data-color='{ "line" : "red"     , "fill" : "#000000"}'></span>
 		
 		<span class="cbWhiteWhite"          data-color='{ "line" : "#FFFFFF" , "fill" : "#FFFFFF"}'></span>
 		<span class="cbBlackBlack"          data-color='{ "line" : "#000000" , "fill" : "#000000"}'></span>
 		<span class="cbRedRed"              data-color='{ "line" : "red"     , "fill" : "red"}'></span>
 		
 		</div>
  <div class="WidgetPaintTool toolWidgetColorPicker"></div>
  <div class="WidgetPaintTool toolWidgetFillColorPicker"></div>
  
  <?php 
  /*
  <!--  Color del Pincel -->
  <div class="WidgetPaintTool toolWidgetColorPicker">
    <b>Color Pincel</b>
    <!-- Color mode -->
    <div class="pColorMode oculto">
      <!--  Selectores -->
      <div class="pSelectores">
        none <input type="radio" name="kindColor" value="none" /> color <input
          type="radio" name="kindColor" value="color" checked /> pattern <input
          type="radio" name="kindColor" value="pattern" />
      </div>
      <!-- Selección del color -->
      <div class="pColor" style="visibility: hidden;">
        Color <input />
      </div>
      <!-- Selección del Pattern -->
      <div class="pPattern" style="visibility: hidden;">
        <select>
        </select>
      </div>
    </div>
    <!-- B&W mode -->
    <form class="pBWMode">
      none <input type="radio" name="colorBWMode" value="none" /> white <input
        type="radio" name="colorBWMode" value="#FFFFFF" checked /> red <input
        type="radio" name="colorBWMode" value="red" /> black <input type="radio"
        name="colorBWMode" value="#000000" />
    </form>
  </div>
 
  <!--  Color del Relleno -->
  <div class="WidgetPaintTool toolWidgetFillColorPicker">
    <b>Color Relleno</b>
    <!--  Color Mode -->
    <div class="pColorMode oculto">
      <!--  Selectores -->
      <div class="pSelectores">
        none <input type="radio" name="kindRelleno" value="none" checked />
        color <input type="radio" name="kindRelleno" value="color" /> red <input
          type="radio" name="kindRelleno" value="red" /> pattern <input
          type="radio" name="kindRelleno" value="pattern" />
      </div>
      <!-- Selección del color -->
      <div class="pColor" style="visibility: hidden;">
        Color <input></input>
      </div>
      <!-- Selección del Pattern -->
      <div class="pPattern" style="visibility: hidden;">
        <select></select>
      </div>
    </div>
    <!-- B&W mode -->
    <form class="pBWMode">
      none <input type="radio" name="fillBWMode" value="none" checked /> white <input
        type="radio" name="fillBWMode" value="#FFFFFF" /> red <input
        type="radio" name="fillBWMode" value="red" /> black <input type="radio"
        name="fillBWMode" value="#000000" />
    </form>
  </div>
  <!-- Círculo-->
  <!-- 
    <div class="WidgetPaintTool toolWidgetToolCirculo oculto">
        <div class="toolActiva oculto">
            <b>CÍRCULO</b><br/>
            Radio : <input type="text" size="4"/>
        </div>
        <div class="toolInactiva">
            Círculos (click activar)
        </div>
    </div>
	 -->
	 */
  ?>
</div>
<script>
	$('#bShowToolBox').click(function(){
	  $('#paintBox').toggle();
	});


	/*
	$('#paintBox').click(function(){
	  $('#paintBox').hide();
	  $('#bShowToolBox').show();
	});
	*/

	/* ---------------------------------------------------------- Borders/Fills */
	/* Select the button */
	$('.toolWidgetLineaRelleno').children().click(function(){
		var $ele = $(this);
		$ele.parent().children().removeClass('selected');
		$ele.addClass('selected');
		var color = $ele.data('color');
		$('body').trigger('lineColor',[color.line]);
		$('body').trigger('bgColor',[color.fill]);
	});
</script>
