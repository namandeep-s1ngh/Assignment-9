const showTable = async () => {
    DOM("add").style.display = "inline-block";
    DOM("divison2").style.display = "none";
    await fetch('http://localhost:3000/details') 
        .then(res => {
            return res.json();
        })       
            .then(res => {
                CRUD.prototype.createTable(res);
            })
        .catch(err => {
            console.log(err);
        })
}

interface create_table {            
    createTable(arr): void;                                                                                                            //using generic for arr gave error.
}

interface delete_row_table {        
    delete_row(obj: HTMLElement): void;
}

interface edit_row_table {                                                                                                             //save and cancel operations will also be defined here. 
    edit_row(obj: HTMLElement, n: number): void;
}

class CRUD implements create_table , delete_row_table, edit_row_table {

    createTable(arr) {           
            
        DOM("load").innerHTML = "Refresh Data";

        let table: string = "<table id='table_data'>" +
                                "<tbody> <tr id = 'heading'>" +
                                    "<th> First Name </th>" +
                                    "<th> Middle Name </th>" +
                                    "<th> Last Name </th>" +
                                    "<th> Email </th>" +
                                    "<th> Phone Number </th>" +
                                    "<th> Address </th>" +                                    
                                    "<th> Customer Name </th>" +
                                    "<th> Role </th>" +
                                    "<th> Created on </th>" +
                                    "<th> Modified on </th>" +
                                "</tr>";

        let count: number = 0;

        for(let i of arr) {

            table += "<tr id="+i.id+">" +
                        "<td><div contenteditable='false'>" +i.firstname+  "</div></td>" +
                        "<td><div contenteditable='false'>" +i.middlename+ "</div></td>" + 
                        "<td><div contenteditable='false'>" +i.lastname+ "</div></td>" +
                        "<td><div contenteditable='false'>" +i.email+ "</div></td>" +
                        "<td><div contenteditable='false'>" +i.phone+ "</div></td>" +                                       
                        "<td><div contenteditable='false'>" +i.address+ "</div></td>" + 
                        "<td><div contenteditable='false'>" +i.custname+ "</div></td>" + 
                        "<td><div contenteditable='false'>" +i.role+ "</div></td>" +                           
                        "<td><div contenteditable='false'>" +i.createdon+ "</div></td>" +
                        "<td><div contenteditable='false'>" +i.modifiedon+ "</div></td>" +                          
                        "<td>" + 
                        "<input type='button' id="+"edit_button"+count+" value='Edit' onclick="+"CRUD.prototype.edit_row(this,"+count+")>" + 
                        "<input type='button' id="+"delete_button"+count+" value='Delete' onclick="+"CRUD.prototype.delete_row(this)>" +  
                        //"<input type='button' id="+"save_button"+count+" value='Save' class='save'>" +
                        //"<input type='button' id="+"cancel_button"+count+" value='Cancel' class='cancel'>" +                            
                        "</td>" +                          
                    "</tr>";                        

                count++;
        }       
                            
        DOM("divison").innerHTML = table + "</table>";        
    }   

    async delete_row (obj: HTMLElement) {
        let ele = obj.parentElement.parentElement;
        let id = ele.id;
        ele.style.display = "none";
        console.log(id);
        await fetch(`http://localhost:3000/details/${id}`, {
            method: "DELETE",
            headers: {}
        })
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })
    }

    async edit_row(obj: HTMLElement, no: number) {
    
        hide(no);
        let save = document.createElement("button");
        save.innerText = "Save";
        save.id = "save";
    
        let cancel = document.createElement("button");
        cancel.innerText = "Cancel";
        cancel.id = "cancel";
    
        obj.parentElement.prepend(save, cancel); 
        
        let ele = obj.parentElement.parentElement;
        let id = ele.id;
        console.log(`id is ${id}`);
    
        //ele.style.backgroundColor = '#FFFF00';
        let list = ele.childNodes;
        for (let i = 0; i < 6; i++) {
            list[i].childNodes[0].contentEditable = "true";
            list[i].childNodes[0].style.backgroundColor = '#FFFF00';
        }

        save.addEventListener('click', async () => {
            await fetch(`http://localhost:3000/details/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                firstname: list[0].childNodes[0].innerText,
                middlename: list[1].childNodes[0].innerText,
                lastname: list[2].childNodes[0].innerText,
                email: list[3].childNodes[0].innerText,
                phone: list[4].childNodes[0].innerText,                
                address: list[5].childNodes[0].innerText
            }), 
            headers: {"Content-type": "application/json; charset=UTF-8"}
            })
            .then(res => {
                return(res.json());                                        
            })
                .then(res => {
                    // console.log(res));
                    for (let i of res) {
                        if (i.id === id) {
                            list[0].childNodes[0].innerText = i.firstname;
                            list[1].childNodes[0].innerText = i.middlename;
                            list[2].childNodes[0].innerText = i.lastname;
                            list[3].childNodes[0].innerText = i.email;
                            list[4].childNodes[0].innerText = i.phone;                        
                            list[5].childNodes[0].innerText = i.address;
                        }
                    }                    
                    //ele.style.backgroundColor = 'white';
                    show(no);
                    save.style.display = 'none';
                    cancel.style.display = "none";
                    
                    for (let i = 0; i < 6; i++){
                        list[i].childNodes[0].contentEditable = "false"; 
                        list[i].childNodes[0].style.backgroundColor = "white";
                    }                   
                })

            .catch(err => {
                console.log(err);
            })
        })

        cancel.addEventListener('click', async () => {
            await fetch(`http://localhost:3000/details/${id}`)
                .then(res => {
                    //console.log(res);
                    return(res.json());

                })
                    .then(res => {
                        console.log(res); 
                        list[0].childNodes[0].innerText = res[0].firstname;
                        list[1].childNodes[0].innerText = res[0].middlename;
                        list[2].childNodes[0].innerText = res[0].lastname;
                        list[3].childNodes[0].innerText = res[0].email;
                        list[4].childNodes[0].innerText = res[0].phone;
                        list[5].childNodes[0].innerText = res[0].address;
                      
                        //ele.style.backgroundColor = 'white';
                        show(no);
                        save.style.display = 'none';
                        cancel.style.display = "none";
                        
                        for (let i = 0; i<6; i++) {
                            list[i].childNodes[0].contentEditable = "false";   
                            list[i].childNodes[0].style.backgroundColor = "white";
                        }
                    })

                .catch(err => {
                    console.log(err);
                })             
        }) 
    }
}


function DOM(id: string): HTMLElement {
    return(document.getElementById(id));
}

function hide(no: number): void {
    DOM("edit_button"+no).style.display = 'none';
    DOM("delete_button"+no).style.display = 'none';
}

function show(no: number): void {
    DOM("edit_button"+no).style.display = 'inline-block';
    DOM("delete_button"+no).style.display = 'inline-block';
}

//function today(): void { DOM("date_time").innerHTML = Date();}
