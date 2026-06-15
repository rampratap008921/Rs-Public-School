// Auto Admission Number

document.getElementById("admissionNo").value =
"RSPS" + Math.floor(Math.random() * 100000);

// Photo Preview

document.getElementById("photo")
.addEventListener("change", function(e){

let file = e.target.files[0];

if(file){

let reader = new FileReader();

reader.onload = function(){

document.getElementById("preview").src =
reader.result;

};

reader.readAsDataURL(file);

}

});

// Form Validation

document.getElementById("admissionForm")
.addEventListener("submit", function(e){

e.preventDefault();

let studentName =
document.getElementById("studentName").value;

let mobile =
document.getElementById("mobile").value;

if(studentName === ""){

alert("Enter Student Name");
return;

}

if(mobile.length !== 10){

alert("Enter Valid Mobile Number");
return;

}

alert("Student Record Saved Successfully");

});