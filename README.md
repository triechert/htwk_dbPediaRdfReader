Description
===========
## This is a raw RDF-JSON analyzer.

The Object is targeted to parse the json-formatted *RDF-Triples* of *db-pedia* in a readable form. 
This means that u can paste the url of a json-formatted rdf-object of db-pedia at _http://http://dbpedia.org/_ inside the input field and get all the triples of the pasted subject. 

Uses just those triples with leading subjects.
For example there are no links that point to the dbpedia-entity.

It only parses the URI's or literals so that u can just see the valuable endings of it. This leads to more readability. 

Try the script here: http://rawgit.com/triechert/htwk_dbPediaRdfReader/develop/index.html

Also Wiki and DBPedia Links are parses: 
ExampleURLs that are formatted right: 
* http://de.dbpedia.org/data/Robert_Schuman.json
* http://de.wikipedia.org/wiki/Robert_Schuman
* http://de.dbpedia.org/data/Hochschule_für_Technik,_Wirtschaft_und_Kultur_Leipzig.json 
* http://de.wikipedia.org/wiki/Hochschule_für_Technik,_Wirtschaft_und_Kultur_Leipzig
* http://de.dbpedia.org/data/Leipzig.json
* http://de.wikipedia.org/wiki/Leipzig

The colors are: 
orange: subjec
grey: predicate
blue: object

## TroubleShooting

Umlauts like 'ü' 'ä' and 'ö' in the link are not parsed well. Please replace them.  
