//For adding new entry in the db.

async function dataEntry() {
    hide_divison();

    let newEntry = {
        id : DOM("table_data").rows.length,
        firstname: DOM("fname").value,
        middlename: DOM("mname").value,
        lastname: DOM("lname").value,
        email: DOM("email1").value,
        phone: DOM("phone1").value,        
        address: DOM("address1").value,
        rid: DOM("role1").value,
        cid: Number(DOM("custname").value)
    };
    
    console.log(newEntry);

    await fetch('http://localhost:3000/details', {
        method: 'POST',
        body: JSON.stringify(newEntry),
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
        .then(res => {
            return res.json();
        })
        .then(res => {
            console.log(res);          
        })            
}


function show_divison(): void {
    DOM("add").style.display = "none";
    DOM("divison2").style.display = "block";
}

function hide_divison(): void {
    DOM("add").style.display = "inline-block";
    DOM("divison2").style.display = "none";
}