var dummy = ["HenryawesomeCourse","Henry","12Dec2012","open"];
var class_for_tr ="contract_row";
var class_for_cell =["contract_cell_title","contract_cell_author","contract_cell_date","contract_cell_status"];

function addRow(r)
{
	var table_ = document.getElementById("contract_table");
	var row_= document.createElement("tr");
	row_.setAttribute("class",class_for_tr);
	var cell_1=document.createElement("td");
		cell_1.setAttribute("class",class_for_cell[0]);

		cell_1.innerHTML="<a href='#'>"+r[0]+"</a>";
		row_.appendChild(cell_1);
	for(var i=1;i<4;i++)
	{
		var cell_=document.createElement("td");
		cell_.setAttribute("class",class_for_cell[i]);
		cell_.innerHTML=r[i];
		row_.appendChild(cell_);
	}

	table_.appendChild(row_);
	
}

Template.planroom.rendered = function () {
	// ...
	addRow(dummy);
};