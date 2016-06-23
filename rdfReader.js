var dbJsonBase = "http://dbpedia.org/data/";
var dbLang = "";

//var dbJsonBase = "http://de.dbpedia.org/data/";
//var dbJsonBase = "http://live.dbpedia.org/data/";

var dbJsonSuffix = ".json"; 
var dbJson = "";
var subjectHeader; 
var loadingLabel = "<span class='loading'> loading ... </span>";
var contentRdf; 


$(document).ready(function(){

	if (window.location.href.split('#')[1]) {
		jQuery('#rdfURI').val(window.location.href.split('#')[1]);
		$("#readRdf").trigger("click");
		
	}

	$("#readRdf").click(function(){
		var input = $('#rdfURI').val();
		parseInput2DbJson(input); 	
		readInputJson();
	});
	contentRdf = $('#rdf');
	dbJsonBase = $("#sprache").val()+'/data/';
	
	if ($("#sprache").val()=="http://dbpedia.org") dbLang="";
	if ($("#sprache").val()=="http://de.dbpedia.org") dbLang="de.";
	if ($("#sprache").val()=="http://nl.dbpedia.org") dbLang="nl.";


});


/**
 * Wikipedia search. 
 * Looks up for articles on wikipedia api and sho them in result div.
 * */
$(document).on("keyup","#searchfield",function(){
	var s = $("#searchfield").val();
        $.getJSON("http://"+dbLang+"wikipedia.org/w/api.php?callback=?",
        {
          srsearch: s, action: "query", list: "search", format: "json"
        },
        function(data) {
          $("#searchresults").empty();
          $.each(data.query.search, function(i,item){
            $("#searchresults").append('<div><a class="uriresult" href="#http://'+dbLang+'dbpedia.org/resource/' + item.title.replace(/ /g,"_") + '">' + item.title + '</a><br/>' + item.snippet + '</div>');
          });
 
 	});

});

/**
 * Language version chanched. 
 * 
 * */
$(document).on("click","#sprache",function(){
	dbJsonBase = $("#sprache").val()+'/data/';
	if ($("#sprache").val()=="http://dbpedia.org") dbLang="";
	if ($("#sprache").val()=="http://de.dbpedia.org") dbLang="de.";
	if ($("#sprache").val()=="http://nl.dbpedia.org") dbLang="nl.";

 });


/**
 * Wikipedia search result clicked. 
 * loads uri in  input field and trigger readRdf click event
 * */
$(document).on("click",".uriresult",function(){
	jQuery('#rdfURI').val($(this).attr("href").substr(1));
	$("#readRdf").trigger("click");
});


$(document).on("click","#showfulluri",function(){
	$("#readRdf").trigger("click");
 });

function parseInput2DbJson(input){
	var inputArr = input.split("/"); 
	var inputLength = inputArr.length; 
	if((inputArr[inputLength - 2] == "wiki")||(inputArr[inputLength - 2] == "resource")){
		dbJson = dbJsonBase + inputArr[inputLength -1] + dbJsonSuffix; 
	}else{
		dbJson = input;
	}
}

function readInputJson(){
	storeSubjectName();
	jQuery.ajax({
		beforeSend	: clearRdf(),
		crossDomain	: true,
		url		: dbJson,
		method		: "GET",
	        dataType	: "jsonp"
	}).done(function(msg){
		parseRdf(msg);
	});
	
}
/*
 * Function to clear content Rdf div
 * */
function clearRdf(){
	contentRdf.html(loadingLabel);
}

/**
 * Parses the json-formatted rdf. 
 * Uses just those triples with leadeing subjects.
 * For example there are no links that point to the dbpedia-entity.
 *
 * */
function parseRdf(json){
	contentRdf.html("<h2>Triples are: </h2> ");

	for(property in json){
		console.log(property);
		if(isSubject(property)){	
		contentRdf.append(createTripleDiv(property, json[property]));
		}
	}
}
/**
 * returns true if the subject-identifier is equals to the 
 * subjectHeader of the given link.
 * The identifier is the literal after tailing / of the subject. 
 * The subjectHeader is the literal between the tailing / and the .json of the given URL in input field.
 * */
function isSubject(subject){
	return splitURI(subject) == subjectHeader;
}
/**
 * Creates the div containing
 * subject - predicate - object
 * */
function createTripleDiv(rdfObject, property){
	var tripleDiv = ""; 
	tripleDiv += createContentDivs(rdfObject,property); 
	return tripleDiv;
}

/*
 * Creates the contents.
 * subject div
 * predicate div
 * object div
 *
 * uses values to set a header 
 * */
function createContentDivs(subject, predicate){
	
	var retString = ""; 
	for(property in predicate){
	 var pred = splitURI(property);
	 var object = predicate[property][0];
	 var val = setObjectValue(property, object);
	 setLabel(pred, val); 
	 retString += "<div class='triple'>"; 
	 retString += "<div class='subject'>" + splitURI(subject) + "</div>";
	 retString += "<div class='predicate'>" + niceuri(property) + "</div>";	
	 retString += "<div class='object "+object.type+" '> "

	 if (object.type=="uri") {
		if($('#showfulluri').is(':checked')) {
			var uritoshow = niceuri(object.value);
		 } else {
			var uritoshow = splitURI(object.value);
		 }
		if (object.value.search(".imp.fu-berlin.de")>0) {
			retString += '<a class="uriresult" href="#'+niceuri(object.value)+'">'+uritoshow+'</a>';
		} else {
			retString += uritoshow;
		}

	 } else {
		retString += val;
	 }

	 retString += "</div>";
	 retString += "</div>";
	}
	return retString; 
}

/*
 * Checks whether the objectType is uri or literal. 
 * If it is URI, it splits to get the identifier only. 
 * */
function setObjectValue(predicate, object){
	var val = object.value; 

	if(object.type == "uri"){
		//console.log(object);
	 	val = splitURI(val);
	}
	 return val;
}

/*
 * Sets a new Header if the label Property is set.
 * */
function setLabel(pred, val){

	 if(pred.indexOf("label") > -1){
	 	jQuery('h2').html("Triples of " + val + " are: ");
	 }
}

function createParagraph(paragraphContent){
	var par = "<p>";
	par += paragraphContent;
	par += "</p>";
	return par; 
}

/*
 * Returns the identifier of an URI. 
 *The identifier is the literal after tailing / of the subject.
 * */
function splitURI(uri){

	var urlArr = uri.split('/');
	return urlArr[urlArr.length -1 ]
}
/**
 * Stores the subjectName as SubjectHeader. 
 * The subjectHeader is the literal between the tailing / and the .json of the given URL in input field.
 * */
function storeSubjectName(){

	subjectHeader = splitURI(dbJson).split('.')[0];
}

function niceuri(uri) {
	var uristr = uri;	
	uristr = uristr.replace("dbpedia.imp.fu-berlin.de:49156","dbpedia.org");
	return uristr;
}




