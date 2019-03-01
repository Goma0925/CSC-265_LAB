

var button = document.getElementById("createList");
console.log(button);

var makeList = function()
{
  console.log("Creating a list by D3");
  var animalList = ["Lion", 'Ostrich', "Zebra","Gazelle", "Zibra"];
  d3.select("#content").selectAll("p").data(animalList).enter().append("p").text(
    function(d){return "D3 added a new animal: " + d});
  console.log("Created a list by D3");
};

var addButton = document.getElementById("add");
var addLi = function(){
  var list = document.getElementById("list");
  var li = document.createElement('li');
  list.appendChild(li);
}
