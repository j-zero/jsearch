// -------- hole GET parameter in globale Variable _GET
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    _GET = {};
    while (match = search.exec(query))
       _GET[decode(match[1])] = decode(match[2]);
})();
// ---------------------------------


// -------- DOCUMENT READY .... 

function generateBtnEngine(engine){
   var engineName = _ENGINES[engine].name;
   var engineImage = _ENGINES[engine].image;
   if(engineImage){
      return "<li title=\"" + _ENGINES[engine].name + "&#10;Shortname: &quot;" + _ENGINES[engine].hotname + "&quot;\" class=\"btnEngine\" engine=\"" + engine + "\"><span class=\"btnImage\"><img class=\"\" src=\"" + _ENGINES[engine].image + "\" alt=\"\" /></span><span class=\"btnText\">" + _ENGINES[engine].name + "</span></li>";
      //return "<li class=\"btnEngine\" engine=\"" + engine + "\"><span style=\"background-image: url(" + _ENGINES[engine].image + ");\" class=\"btnText\">" + _ENGINES[engine].name + "</span></li>";
    }
  else{
      return "<li title=\"" + _ENGINES[engine].name + "&#10;Shortname: &quot;" + _ENGINES[engine].hotname + "&quot;\" class=\"btnEngine\" engine=\"" + engine + "\"><span class=\"btnImage\"></span><span class=\"btnText\">" + _ENGINES[engine].name + "</span></li>";
      //return "<li class=\"btnEngine\" engine=\"" + engine + "\"><span class=\"btnText\">" + _ENGINES[engine].name + "</span></li>";
  }
}

function generateLblEngine(engine){
   var engineName = _ENGINES[engine].name;
   var engineImage = _ENGINES[engine].image;
   if(engineImage){
     return "<div><img class=\"lblImage\" src=\"" + engineImage + "\" alt=\"\" /><span class=\"lblWithImage\" id=\"lblSearchEngine\">" + engineName + "</span></div>";
   }
   else{
     return "<div><span id=\"lblSearchEngine\">" + engineName + "</span></div>";
   }
}

//$( document ).ready(function() {
$(function() {
  _ENGINES = getEnginesFromJSON(); 
  _FASTSEARCH = true;
  
  if(typeof(_GET['s']) != 'undefined' && typeof(_GET['f']) != 'undefined' ){
    doSearch(_GET['s'],true,defaultEngine,true);
  }
  else if(typeof(_GET['f']) == 'undefined' ){
    $("#txtSearch").val(_GET['s']);
  }

  $("#Engines2").hide();
  $("#divConSearchLabel").hide();
  $("#divConSearchButton").hide();
  $("#hiddenSearchEngine").val(defaultEngine);
  $("#hiddenFSQuery").val("");
  $("#txtSearch").focus();

  $( "#Engines1, #Engines2" ).sortable({
        connectWith: ".connectedEngines",
        placeholder: "ui-state-highlight",
        stop: function(event, ui){
          setCookieCurrentOrder();
        }
    }).disableSelection();


  if($.cookie('engines1') && $.cookie('engines2')){
      console.log("cookies found!");
       $.each(($.cookie('engines1').split(',')), function(key,val){
          $("#Engines1").append(generateBtnEngine(val));
       });
       $.each(($.cookie('engines2').split(',')), function(key,val){
          $("#Engines2").append(generateBtnEngine(val));
       });

  }
  else{
    $.each(_ENGINES, function(key, value){
        if(value.row == 0){
          $("#Engines1").append(generateBtnEngine(key));
        }
        else{
          $("#Engines2").append(generateBtnEngine(key));
        }
    });
  }



  $('#txtSearch').keyup(function(event) {
    if (event.keyCode == 13) { // RETURN
      doSearch($("#hiddenFSQuery").val() + this.value,_FASTSEARCH,getCurrentSearchEngine(),false);
    }
    if(event.keyCode == 8) { // BACKSPACE
      if(!$(this).val()){ 
        $("#hiddenFSQuery").val("");
        $("#hiddenSearchEngine").val(defaultEngine);
        $("#lblSearchEngine").html("");
        $("#divConSearchLabel").hide();
        $("#divConSearchButton").hide();
        _FASTSEARCH = true;
      }
    }

   if(_FASTSEARCH){
    if($(this).val()){
          $("#divConSearchButton").show();
    }
    else{
          $("#divConSearchButton").hide();
    }


    if(event.keyCode == 27){  // ESCAPE
        // TODO wenn escape gedrueckt wurde, parsing deaktivieren...
        $("#hiddenFSQuery").val("");
        var parsedQuery = parseQuery($("#hiddenFSQuery").val() + $("#txtSearch").val());
        if(parsedQuery.is){
          $("#hiddenFSQuery").val(parsedQuery.matched); 
          $("#txtSearch").val(parsedQuery.query);
          $("#hiddenSearchEngine").val(parsedQuery.engine);
      //    $("#lblSearchEngine").html(_ENGINES[parsedQuery.engine].name);
          $("#divConSearchLabel").show();
          $("#divConSearchButton").show();
          $("#divConSearchLabel").html(generateLblEngine(parsedQuery.engine));
      
        } 
    }

    if(event.ctrlKey && event.keyCode == 13){ // CTRL + RETURN
        $("#hiddenFSQuery").val("");
        var parsedQuery = parseQuery($("#hiddenFSQuery").val() + $("#txtSearch").val());
        if(parsedQuery.is){
          $("#hiddenFSQuery").val(parsedQuery.matched); 
          $("#txtSearch").val(parsedQuery.query);
          $("#hiddenSearchEngine").val(parsedQuery.engine);
          doSearch($("#hiddenFSQuery").val() + this.value,_FASTSEARCH,getCurrentSearchEngine(),false);
        } 
    }

    var parsedQuery = parseQuery($("#hiddenFSQuery").val() + $("#txtSearch").val());
    if(parsedQuery.is){

      $("#hiddenFSQuery").val(parsedQuery.matched); 
      $("#txtSearch").val(parsedQuery.query);
      $("#hiddenSearchEngine").val(parsedQuery.engine);
      $("#divConSearchLabel").html(generateLblEngine(parsedQuery.engine));
      $("#divConSearchLabel").show();
      $("#divConSearchButton").show();
     } 
        
    }
  });

/*  $("#dbgButton").click(function(event){
    setCookieCurrentOrder();
  });
*/

  $("#divConSearchButton").click(function(event){
      doSearch($("#hiddenFSQuery").val() + $("#txtSearch").val(),_FASTSEARCH,getCurrentSearchEngine(),false);
  });

  $(".btnEngine").click(function(event){
      if($(this).hasClass("selectedEngine")){
        $(this).removeClass("selectedEngine");
        $("#hiddenFSQuery").val("");
        $("#hiddenSearchEngine").val(defaultEngine);
        $("#lblSearchEngine").html("");
        $("#divConSearchLabel").hide();
        $("#divConSearchButton").hide();
        _FASTSEARCH = true;
      }
      else{
        $(".btnEngine").removeClass("selectedEngine");
        $(this).addClass("selectedEngine");
        var newEngine = $(this).attr("engine");
        setSearchEngine(newEngine);
      }
  });
  

  var elem = $( "#txtSearch" ).autocomplete({
    source: function (request, response) {
      $.ajax({
        url: "http://google.com/complete/search",
        data: { output: "firefox", q: request.term , hl: "de"}, 
        dataType: "jsonp",
        cache: false,
        success: function (data) {
          result = data[1];
          response(result);
        },
        error: function (data, txt, thrown){
          result = [];
          response(result);
        }
      });
    },
    minLength: 2,
    select: function( event, ui) {
      doSearch($("#hiddenFSQuery").val() + this.value,_FASTSEARCH,getCurrentSearchEngine(),false);
    }
  });


  $("#engineSeperator").click(function(event){
      if($("#Engines2").is(":visible")){
          $("#Engines2").hide();
          $("#engineSeperatorArrow").removeClass("ui-icon-triangle-1-n");
          $("#engineSeperatorArrow").addClass("ui-icon-triangle-1-s");
          $("#divHeadLine").removeClass("row2-open");
      }
      else{
          $("#Engines2").show();
          $("#engineSeperatorArrow").removeClass("ui-icon-triangle-1-s");
          $("#engineSeperatorArrow").addClass("ui-icon-triangle-1-n");
          $("#divHeadLine").addClass("row2-open");
      }
  });
  

});

function setSearchEngine(engine){
        _FASTSEARCH = false;
        var orgQuery = $("#hiddenFSQuery").val() + $("#txtSearch").val();
        var newEngine = _ENGINES[engine];
        $("#hiddenFSQuery").val(newEngine.matched);
        $("#hiddenSearchEngine").val(engine);
      //  $("#lblSearchEngine").html(newEngine.name);
        $("#divConSearchLabel").show();
        $("#divConSearchButton").show();
        $("#txtSearch").val(orgQuery);
        $("#txtSearch").focus();
        $("#divConSearchLabel").html(generateLblEngine(engine));
        
}

function getCurrentSearchEngine(){
  return $("#hiddenSearchEngine").val();
}

function doSearch(searchTerm, fastSearch, engine, nohistory){
    var resultUri = "";
    var resultTerm = searchTerm;
    resultTerm = resultTerm.replace("#","%23");
    resultTerm = resultTerm.replace("&","%26");
    resultTerm = resultTerm.replace("+","%2B");
    if(fastSearch){
      var parsedQuery = parseQuery(resultTerm);
      resultUri = parsedQuery.searchUri; 
    }
    else{
      var searchUri = _ENGINES[engine].uri.replace("%s",resultTerm);
      resultUri = searchUri; 
    }

    

    if(nohistory){
    //location.href = parsedQuery.searchUri; 
      location.replace(resultUri); 
    }
    else{
      location.href = resultUri; 
    }
}

function setCookieCurrentOrder(){
  var engines1 = $.map($("#Engines1 .btnEngine"), function (e){
    return $(e).attr("engine");
  });
  var engines2 = $.map($("#Engines2 .btnEngine"), function (e){
    return $(e).attr("engine");
  });
  console.log("Cookie1:");
  console.log(engines1);
  console.log("Cookie2:");
  console.log(engines2);
  $.cookie('engines1',  engines1, {expires: 3000});
  $.cookie('engines2',  engines2, {expires: 3000});
}

// HERE BE DRAGONS
// ---------------------------------


