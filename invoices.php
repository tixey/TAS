<?php
    require( 'php/config.php' );
    require( 'php/db_functions.php' );
    require( 'php/session.php' );
?>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>TAON Company Limited - Invoices</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />

    <!-- External -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js" integrity="sha512-xQBQYt9UcgblF6aCMrwU1NkVA7HCXaSN2oq0so80KO+y68M+n64FOcqgav4igHe6D5ObBLIf68DWv+gfBowczg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.10.1/polyfill.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/exceljs/3.8.0/exceljs.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script>window.jQuery || document.write(decodeURIComponent('%3Cscript src="js/jquery.min.js"%3E%3C/script%3E'))</script>

    <!-- DevExpress -->
    <link rel="stylesheet" type="text/css" href="https://cdn3.devexpress.com/jslib/21.2.4/css/dx.common.css" />
    <link rel="stylesheet" type="text/css" href="https://cdn3.devexpress.com/jslib/21.2.4/css/dx.light.css" />
    <script src="https://cdn3.devexpress.com/jslib/21.2.4/js/dx.all.js"></script>

    <!-- Internal -->
    <link   rel="stylesheet" href="css/styles.css"/>
   
    <script src="js_global/config.js"></script>
    <script>
        
        const loadTool = () => { 

            const mainLayout = {
                name: 'mainLayout'
            }
            const mainMenu = {
                name: 'mainMenu',
                params: {SelectedIndex: 1}
            }
            const invoicesGrid = {
                name: 'invoicesGrid'
            }
            const loadStores = () => Stores.load([{name:'currencies'},{name:'counterPartiesGrid'},{name:'invoicesGrid'}])
            const loadMainLayout = () => Components.load([mainLayout])
            const loadComponents = () => Components.load([mainMenu,invoicesGrid])
            loadMainLayout()
                .then(loadStores)
                .then(loadComponents)
        }
        Config.loadEngineScripts().then(loadTool)
    </script>

</head>
<body class="dx-viewport">


</body>
</html>