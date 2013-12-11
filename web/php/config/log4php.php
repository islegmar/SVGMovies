<?php
/* __FILE__ is  /.../__deployment__/last/log4pgp/configurators/ */
$defLogPattern = '%d %p %c [%F#%M] - %m%n';
return array(
		'rootLogger' => array(
				'level' => 'DEBUG'
		),
		'appenders' => array(
				'main' => array(
						'class' => 'LoggerAppenderRollingFile',
						'layout' => array(
								'class' => 'LoggerLayoutPattern',
								'params' => array(
										'conversionPattern' => $defLogPattern
								)
						),
						'params' => array(
								'file' => $_SERVER['DOCUMENT_ROOT'] . '/logs/svgmovies-main.log',
								'maxFileSize' => '1MB',
								'maxBackupIndex' => 5,
						)
				),
				'error' => array(
						'class'  => 'LoggerAppenderMail',
						'layout' => array (
							'class' => 'LoggerLayoutPattern',
							'params' => array(
							  'ConversionPattern' => '%d{Y-m-d H:i:s} [%p] %c: %m (at %F line %L)%n'
							)
						),
						'params' => array(
							'from' => 'islegmar@gmail.com',
							'to' => 'islegmar@gmail.com',
							'subject' => 'Error SVGMovies'
						),
						'filters' => array(
								array(
									'class' => 'LoggerFilterLevelRange',
									'params' => array(
										'LevelMin' => 'error',
										'LevelMax' => 'fatal'	
									)
								),
								array(
										'class' => 'LoggerFilterDenyAll'
								)
						)
				)
		),
		'loggers' => array (
				'level' => 'DEBUG',
				'main' => array (
					'appenders' => array(
							'main', 'error'
					)
				)
		)
);
?>
