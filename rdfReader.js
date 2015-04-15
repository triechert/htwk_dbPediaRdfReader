var dbJsonDepr = "http://de.dbpedia.org/data/Hochschule_für_Technik,_Wirtschaft_und_Kultur_Leipzig.json";
var dbJson = "";
var subjectHeader; 
var loadingLabel = "<span class='loading'> loading ... </span>";
var contentRdf; 
jQuery(document).ready(function(){
	$("#readRdf").click(function(){
		dbJson = jQuery('#rdfURI').val();
		readInputJson();
	});
	contentRdf = jQuery('#rdf');
});


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
	contentRdf.html("<h2>The contents are: </h2> ");

	for(property in json){
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
	var tripleDiv = "<div class='triple'>"; 
	tripleDiv += createContentDivs(rdfObject,property); 
	tripleDiv += "</div>";
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
	//console.log(predicate);	
	var retString = ""; 
	for(property in predicate){
	 var pred = splitURI(property);
	 var object = predicate[property][0];
	 var val = setObjectValue(object);
	 setLabel(pred, val); 
	 retString += "<div class='subject'>" + splitURI(subject) + "</div>";
	 retString += "<div class='predicate'>" + splitURI(property) + "</div>";	
	 retString += "<div class='object'> " + val + "</div>";
	 retString += "<br>";
	}
	return retString; 
}

/*
 * Checks whether the objectType is uri or literal. 
 * If it is URI, it splits to get the identifier only. 
 * */
function setObjectValue(object){
	var val = object.value; 
	 if(object.type == "uri"){
	 	val = splitURI(val); 
	 }
	 return val;
}

/*
 * Sets a new Header if the label Property is set.
 * */
function setLabel(pred, val){

	 if(pred.indexOf("label") > -1){
	 	jQuery('h2').html("The Contents of " + val + " are: ");
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
