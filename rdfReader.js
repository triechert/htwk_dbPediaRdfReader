var dbJsonDepr = "http://de.dbpedia.org/data/Hochschule_für_Technik,_Wirtschaft_und_Kultur_Leipzig.json";
var dbJson = "";
var subjectHeader; 
var loadingLabel = "<span class='loading'> loading ... </span>";
var contentRdf; 
jQuery(document).ready(function(){
	$("#readRdf").click(function(){
		dbJson = jQuery('#rdfURI').val();
		readLocalJson();
	});
	contentRdf = jQuery('#rdf');
});


function readLocalJson(){
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

function clearRdf(){
	contentRdf.html(loadingLabel);
}

function parseRdf(json){
	//var rdfs = sortRdf(json);
	contentRdf.html("<h2>The contents are: </h2> ");

	for(property in json){
		if(isSubject(property)){	
		contentRdf.append(createTripleDiv(property, json[property]));
		}
	}
}

function isSubject(subject){
	console.log(subjectHeader); 
	console.log(subject);
	return splitURI(subject) == subjectHeader;
}

function createTripleDiv(rdfObject, property){
	var tripleDiv = "<div class='triple'>"; 
	//tripleDiv += createSubjectSpan(rdfObject);
	tripleDiv += createPredicateSpan(rdfObject,property); 
	tripleDiv += "</div>";
	return tripleDiv;
}

function createSubjectSpan(subject){
		
	return "<div class='subject'>" + splitURI(subject) + "</div>";
}

function createPredicateSpan(subject, predicate){
	//console.log(predicate);	
	var retString = ""; 
	for(property in predicate){
	 var pred = splitURI(property);
	 retString += "<div class='subject'>" + splitURI(subject) + "</div>";
	 retString += "<div class='predicate'>" + splitURI(property) + "</div>";	
	 var object = predicate[property][0];
	 var val = object.value;
	 if(pred.indexOf("label") > -1){
	 	jQuery('h2').html("The Contents of " + val + " are: ");
	 }
	 if(object.type == "uri"){
	 	val = splitURI(val); 
	 }
	 retString += "<div class='object'> " + val + "</div>";
	 retString += "<br>";
	}
	return retString; 
}

function createParagraph(paragraphContent){
	var par = "<p>";
	par += paragraphContent;
	par += "</p>";
	return par; 
}


function splitURI(uri){

	var urlArr = uri.split('/');
	return urlArr[urlArr.length -1 ]
}

function storeSubjectName(){

	subjectHeader = splitURI(dbJson).split('.')[0];
}
