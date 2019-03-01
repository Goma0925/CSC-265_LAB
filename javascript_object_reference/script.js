var box = {};
box.stapler = "black";
box["waterBottle"] = "Full";

box.waterBottle.color = {
  content: "water",
  color: "black",
  condition: "leaky",
  drink: function(){
    console.log("glug");
  },
};

console.log(box);

//Create a new box
//Create a method for a generic object
var makeBottle function(content, color, cond){
  return {
  }
};

//Other way to declare an object
function myObject() {
  this.property1 = "value1";
  this.property2 = "value2";
  var newValue = this.property1;
  this.performMethod = function() {
    myMethodValue = newValue;
    return myMethodValue;
  };
  }
  var myObjectInstance = new myObject();
  alert(myObjectInstance.performMethod());


  //Create a table
table = d3.select(".table");
rows = table.
rows.append("td")
