console.log('>>>>>');

$(document).ready(function() {
	console.log("ready!");

	carregaTabela();
});

function carregaTabela() {

	console.log(">>>tabela<<<<");

	$.ajax({
		method : "GET",
		url : "/json",
		dataType : "json"
	}).done(setTabela).fail(function(jqXHR, textStatus) {
		console.log("Request failed: ", textStatus, jqXHR);
	});
}



function setTabela (json) {
	console.log( json );

//	var table = $('#dataTable').DataTable( {
//        "ajax": "data/arrays.txt",
//        "columnDefs": [ {
//            "targets": -1,
//            "data": null,
//            "defaultContent": "<button>Click!</button>"
//        } ],
//        retrieve: true,
//        paging: false
//    } );
 
    
	var t = $('#dataTable').DataTable({
		"columnDefs": [
            {
                "targets": [ 1 ],
                "visible": false,
                "searchable": false
            }
        ],
        retrieve: true,
        paging: false
	});
	
	json.forEach(function(item, i){
		let num = item.numero;
		if( !num ) num = "?";
		let valor = item.valor;
		if( !valor) valor = "?";
		let objeto = item.objeto;
		if( !objeto) objeto ="?";
		
		t.row.add( [
			item.id,
            num,
//            item.UASG,
            valor,
            objeto,
            '<button class="fa fa-info"></button>'
        ] ).draw( false );
	})
	
	$('#dataTable tbody').on( 'click', 'button', function () {
        var data = t.row( $(this).parents('tr') ).data();
        console.log("....", data );
        
        buscaInfo(data);
        
        
    } );
	
//	$('#dataTable').dataTable( {
//		  "columns": [
//		    { "width": "20%" },
//		    null,
//		    null
//		  ]
//		} );
	
}

function buscaInfo( dado ){
	
	$.ajax({
		method : "GET",
		url : "/info?id="+dado[0],
		dataType : "json"
	}).done(apresentaInfo).fail(function(jqXHR, textStatus) {
		console.log("Request failed: ", textStatus, jqXHR);
	});
}

function apresentaInfo(json){
	
	console.log( json );
	json = json[0];
	console.log( json );
	
	$("#logoutModal").modal();
	
	var html = "<br/><b>Arquivo: </b>"+json.nomearquivo+
	"<br/><b>Grupo: </b>"+json.nomegrupo+
	"<br/><b>nomesubgrupo: </b>"+json.nomesubgrupo+
	"<br/><b>tipo: </b>"+json.tipo+
	"<br/><b>evento: </b>"+json.dado.evento;
	if( json.dado.tipo) html += "<br/><b>tipo: </b>"+json.dado.tipo;
	
	if( json.dado.data ){
		html += "<br/><b>Data: </b>"+json.dado.data.data+ " - "+json.dado.data.tipo
	}
	
	html += "<br/><b>UASG: </b>"+json.dado.UASG;
	html += "<br/><b>valor: </b>"+json.dado.valor;
	if( json.dado.valorLiteral ) html += "<br/><b>valorLiteral: </b>"+json.dado.valorLiteral;
	
	html += "<br/><b>objeto: </b>"+json.dado.objeto;
	html += "<br/><b>DODF: </b>"+json.dado.DODF;
	html += "<br/><b>modalidade: </b>"+json.dado.modalidade;
	html += "<br/><b>conteudo: </b>"+json.conteudo;
	if( json.problema ){
		html += "<br/><b>Problema: </b>"+json.problema;
	}
	
	html = "<span>"+ html+ "</span>";
	
	
	$("#logoutModal .modal-body").html(html);
	
	
}

