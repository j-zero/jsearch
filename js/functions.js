function getEnginesFromJSON(){
var engines;
  $.ajax({
    url: "data/engines.json",
    dataType: 'json',
    async: false,
    success: function(data) {
      engines = data;
    }
   });
  return engines;
}

function parseQuery(query){
  var arr = query.split(" ");
  var isHotName = false;
  var newQuery = query;
  var hotName = "";
  var searchUri = "";
  var engine = defaultEngine;
  var matchedHotName = "";
  
  $.each(_ENGINES, function(i, val){
      var regex = new RegExp(val.hotname,'i');
      if(regex.test(query)){
        var match = query.match(val.hotname);
        console.log(query);
        console.log(match);
        engine = i;
        isHotName = true;
        arr.shift();
        newQuery = arr.join(" ");
        hotname = val.hotname; 
        console.log("Hotname: " + hotname);
        if(match != null){
          if(match[1] == undefined){ match[1] = "";}
          searchUri = val.uri.replace("%s",match[1]);
          matchedHotName = query.replace(match[1],"");
        }
        else{
          searchUri = val.uri.replace("%s",query);
          matchedHotName = query;
        }
        if(val.replacements){
          $.each(val.replacements, function(key, value){
            searchUri = searchUri.replace(key, value);
            console.log(searchUri);
          });
        }
        return false;
      }
  });

  if(isHotName == false){
    engine = defaultEngine;
    defEngine = getDefaultEngine();
    searchUri = defEngine.uri.replace("%s",newQuery);
  }

  return { "engine": engine, "is": isHotName, "query": newQuery, "matched": matchedHotName, "hotname": hotName, "searchUri": searchUri};
}

function getDefaultEngine(){
  // TODO get default search engine from cookie!
  return _ENGINES[defaultEngine];
}

function getOpenSearchUriFromEngine(engine){
  if(engine in _ENGINES){
    return _ENGINES[engine].openSearchUri;
  }
  return null;
}

function getOpenSearchParametersFromEngine(engine,searchTerm){
  var params = _ENGINES[engine].openSearchParameters;
  console.log("SearchTermReplacement: " + searchTerm);
  $.each(params, function(key,val) {
      params[key] = val.replace("%s",searchTerm);
  });
  return params;
}
