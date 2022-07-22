<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
<link rel="search" type="application/opensearchdescription+xml" title="jSearch2" href="https://search.j-zero.de/2/jsearch2.xml">
  <title>jSearch2</title>
<?php
  if(!isset($_GET['f'])){ // DIREKTSUCHE
  echo '<link rel="stylesheet" href="css/jquery-ui-1.10.3.custom.css" type="text/css" media="screen" />';
  echo "\n";
  echo '<link rel="stylesheet" href="css/jsearch2.css" type="text/css" media="screen" />';
  }
?>
  <script type="text/javascript" src="js/jquery.js"></script>
  <script type="text/javascript" src="js/jquery-ui.js"></script>
  <script type="text/javascript" src="js/jquery.cookie.js"></script>
  <script type="text/javascript" src="js/global.js"></script>
  <script type="text/javascript" src="js/functions.js"></script>
  <script type="text/javascript" src="js/main.js"></script>
</head>
<body>
<?php
  if(!isset($_GET['f'])){ // DIREKTSUCHE
    include("body.php");
    include("bottom.php");
  }
  else{
    echo "<div id=\"divRedirect\"><span>Weiterleitung...</span></div>";
  }
?>
</body>
</html>
