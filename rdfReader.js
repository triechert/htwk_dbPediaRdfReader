var localJson = "file://home/lkh/workspace/coding/project/semWeb/semI/htwk.json"
jQuery(document).ready(function(){
	$("#readRdf").click(function(){
		readLocalJson();
	});
});


function readLocalJson(){
	alert(localJson);	
}
