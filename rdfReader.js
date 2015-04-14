var localJson = "file://home/lkh/workspace/coding/project/semWeb/semI/htwk.json";
var loadingLabel = "<span class='loading'> loading ... </span>";
jQuery(document).ready(function(){
	$("#readRdf").click(function(){
		readLocalJson();
	});
});


function readLocalJson(){
	jQuery.ajax({
		beforeSend: clearRdf(),
	});
}

function clearRdf(){
	jQuery('#rdf').html(loadingLabel);
}
