 let arr=[];
 let endIndex=-1;
let sortedarr=[];
let currentview=[];
let currentrow=5;
let startpage=1;
let change=false;
const check=/^\w+$/;
const datefield=document.getElementById("date");
const taskfield=document.getElementById("task");
const descfield=document.getElementById("desc");
const duefield=document.getElementById("due_Date");
const timefield=document.getElementById("Time");
const submitbtn=document.getElementById("submit");
const warning=document.getElementById("warning");
const required=[datefield,taskfield,duefield,timefield];


function datechecker(){
    if(duefield.value && datefield.value && duefield.value<datefield.value){
        duefield.style.border="2px solid red";
        duefield.style.bckground="red";
        submitbtn.disabled=true;
        alert("Due Date must be higher than Date");
        return false;
    }
    else if(datefield.value && !(duefield.value)){
 duefield.style.border="2px solid red";
        duefield.style.bckground="red";
        submitbtn.disabled=true;
        return false;
    }
    else{
         duefield.style.border="";
        duefield.style.bckground="";
        return true;
    }
}
datefield.addEventListener('change',datechecker);
duefield.addEventListener('change',datechecker);


function checkfield(){
    const anyfill=required.some(f=>f.value!=="");
    if(anyfill){
        required.forEach(t=>{
            if(t.value===""){
                 t.style.border="2px solid red";
        t.style.bckground="red";
        submitbtn.disabled=true;
            }
       
        else{
            t.style.border="";
        t.style.bckground="";
        } });
    }
    else{
        required.forEach(t=>{
            t.style.border="";
        t.style.bckground="";
        })
    }
 const test2 = (check.test(taskfield.value));
 const test3=datechecker();
const test=required.every(t=>t.value.trim()!=='');

    submitbtn.disabled=!(test2 && test3 && test);

}

required.forEach(t=>{
    t.addEventListener('input',checkfield);
    t.addEventListener('change',checkfield);
});
checkfield();
$(document).ready(function(){
    $('#date').Zebra_DatePicker({
        format:'d-m-Y',
        onSelect:function(view,elements){
            checkfield();
        }
     } );
   });
 $(document).ready(function(){
            $('#due_Date').Zebra_DatePicker({
                format:'d-m-Y',
                onSelect:function(view,elements){
            checkfield();
            datechecker();
        }
            });
        });        
const i1=document.getElementById("task");
document.addEventListener("beforeinput",(e)=>{
    const newvalue=i1.value.slice(0,i1.selectionStart)+e.data+i1.value.slice(i1.selectionEnd);
    if(!check.test(newvalue)){
        e.preventDefault();
    }
});



 function add() {
const date=document.getElementById("date").value;
const task=document.getElementById("task").value;
const desc=document.getElementById("desc").value;
const due=document.getElementById("due_Date").value;
const time=document.getElementById("Time").value;
if(!date || !task || !due || !time){
    alert("Date,Task,desc,due,time fields are required");
    return;
}

const exist = arr.some((t,i)=>
   t.date ===date && t.task.toLowerCase()=== task.toLowerCase() && i!== endIndex
);
if(exist){
    alert("Duplication Detected");
    return;
}
const todos={date,task,desc,due,time,status:"Pending"};
if(endIndex===-1){
arr.push(todos);}
else{
    arr[endIndex]={...todos,status:arr[endIndex].status};
    endIndex=-1;
    document.getElementById("submit").innerText="Add";
}
SaveLocal();
display(arr);
currentview=[...arr];
document.getElementById("task").value='';
document.getElementById("desc").value ='';
document.getElementById("date").value="";
document.getElementById("due_Date").value="";
document.getElementById("Time").value="";
submitbtn.disabled=true;
    }



function display(array=currentview){
    const final=document.getElementById("list");
    final.innerHTML="";
     const viewopt=document.getElementById("view").value;
         if(viewopt==="tile"){
               const page=document.getElementById("page");
               const pageno=document.getElementById("pageno");
           page.disabled=true;
           pageno.style.display='none'
           const finalcontainer=document.createElement("div");
           finalcontainer.className="row-container";
           final.appendChild(finalcontainer);
    array.forEach((todo,index) => {
     const data=document.createElement("div");
     data.className="row";
    data.innerHTML=`  
    <div class="box1"><span>Date: ${todo.date}</span><span>Due Date:   ${todo.due}</span>
    <span> Time:  ${todo.time}</span></div>     
        <div class="box2">Task: ${todo.task} <br></div>
        <div class="box3">Description: ${todo.desc}</div>
        <div class="box4">
         <select onchange="update_status(${index},this.value)" class="drop" id="status">
        <option ${todo.status === 'Pending' ? 'selected' : ''}>Pending</option>
        <option ${todo.status=== 'InProgress'? 'selected' : ''}>InProgress</option>
         <option ${todo.status=== 'Completed'? 'selected' : ''}>Completed</option>
          <option ${todo.status=== 'Expire'? 'selected' : ''}>Expire</option>
        </select></div>
   <div class="button">
        <button onclick="edit(${index})" class="btn">Edit</button>
        <button onclick="Delete(${index})" class="btn">Delete</button>
        </div>
        `;
       finalcontainer.append(data);
       const select = data.querySelector("select");
       const button=data.querySelector("button");
    if(todo.status==="Expire"){
data.style.border="1px solid red";
data.style.background="red";
select.disabled=true;
button.disabled=true;
    }
    else{
        data.style.border="";
        data.style.background="rgb(212, 170, 195)";
        select.disabled=false;
        button.disabled=false;
    }
    });

       
 }
         if(viewopt==="Table"){
           const page=document.getElementById("page");
           const pageno=document.getElementById("pageno");
           page.disabled=false;
            pageno.style.display='block'
           displayTable();
           }}
document.getElementById("page").addEventListener("change",(e)=>{
        currentrow=parseInt(e.target.value,10);
        startpage=1;
        displayTable();
    });



function displayTable(){
       const final=document.getElementById("list");
    final.innerHTML="";
            const table=document.createElement("table");
            table.id="table-container";
            table.innerHTML=`
            <thead>
            <tr class="Head">
            <th>Date</th>
            <th>Task</th>
            <th>Status</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Time</th>
            <th>Edit</th>
            <th>Delete</th>
            </tr>
            </thead>
            <tbody id="body">
            </tbody>
            `    
            const start=(startpage-1)*currentrow;
            const end=start+currentrow;
          const  pagerows=currentview.slice(start,end);
          const body=table.querySelector("tbody");
     pagerows.forEach((todo,i) => {
     const data=document.createElement("tr");
      const realindex=start+i;
    data.innerHTML=`  
    <td> ${todo.date}</td>  <td> ${todo.task} </td> <td>
         <select onchange="update_status(${i},this.value)" class="drop">
        <option ${todo.status === 'Pending' ? 'selected' : ''}>Pending</option>
        <option ${todo.status=== 'InProgress'? 'selected' : ''}>InProgress</option>
         <option ${todo.status=== 'Completed'? 'selected' : ''}>Completed</option>
          <option ${todo.status=== 'Expire'? 'selected' : ''}>Expire</option>
        </select></td>
        <td> ${todo.desc}</td> <td>  ${todo.due}</td><td>   ${todo.time}</td>
   <td>
        <button onclick="edit(${realindex})" class="btn">Edit</button></td>
       <td> <button onclick="Delete(${realindex})" class="btn">Delete</button></td>
        
        ` ; body.appendChild(data);
        const select = data.querySelector("select");
        const button=data.querySelector("button");
         if(todo.status==="Expire"){
data.style.border="1px solid red";
data.style.background="red";
select.disabled=true;
button.disabled=true;
    }
    else{
        data.style.border="";
        data.style.background="rgb(212, 170, 195)";
        select.disabled=false;
        button.disabled=false;
    }
    });
    final.appendChild(table);
    renderPage();       
}

function statuschange(final){
        const [day,month,year]=final.due.split("-").map(Number);
        const[hour,min]=final.time.split(":").map(Number);
        return new Date(year,month-1,day,hour,min);
   
}

function checkExpire(){
    const statusinterval=setInterval(()=>{
    const now=new Date();
    currentview.forEach((todo,i)=>{
        const datetime=statuschange(todo);
        if(datetime<now && todo.status!="Expire"){
            todo.status="Expire";
        }else{
            todo.status=todo.status;        }
    });
    SaveLocal();
    display(currentview);
},10000);
}
function renderPage(){
    const page=document.getElementById("pageno");
    const viewopt=document.getElementById("view").value;
    if(viewopt!=="Table"){
        page.innerHTML="";
        return;
    }else{
    page.innerHTML="";
    const totalpage=Math.ceil(currentview.length/currentrow);
    for(let i=1;i<=totalpage;i++){
    const btn=document.createElement("button");
    btn.id="pagenos";
    btn.textContent=i;
    if(i==startpage){
    btn.style.fontWeight="bold";
      btn.style.backgroundColor="black";
    btn.style.color="white";}
    btn.onclick=()=>{
    startpage=i;
    displayTable();};
   page.appendChild(btn);}
}}



function Delete(index){
arr.splice(index,1);
SaveLocal();
currentview=[...arr];
display(currentview);
}



function edit(index){
    document.getElementById("submit").innerText="Update";
    const todo=currentview[index];
document.getElementById("date").value=todo.date;
document.getElementById("task").value=todo.task;
document.getElementById("desc").value=todo.desc;
document.getElementById("due_Date").value=todo.due;
document.getElementById("Time").value=todo.time;
endIndex=arr.indexOf(todo);
checkfield();
datechecker();
display(currentview);
}



function update_status(index,value){
    arr[index].status=value;
    SaveLocal();
display(arr);
}



document.getElementById("sortbtn").addEventListener('click',sort_filter);
document.getElementById("filterbtn").addEventListener('click',sort_filter);

function sort_filter(){
    const choice=document.getElementById("choose").value;
    if(choice==="All"){
      currentview=[...arr];
    }else{
   currentview= arr.filter(fil=>fil.status===choice)
    }
    const order=document.getElementById("opt").value;
    if(order==='A-Z' || order==='Z-A'){
    currentview.sort((a,b)=>{
        const name1=a.task.toLowerCase();
        const name2=b.task.toLowerCase();
        if(name1<name2) return order==='A-Z'?-1:1;
        if(name2<name1) return order==='A-Z'?1:-1; 
        return 0;
    });}
        display(currentview);
}



function SaveLocal(){
    localStorage.setItem("todos",JSON.stringify(arr));
}
window.onload=function(){
    const saved=localStorage.getItem("todos");
    if(saved){
        arr=JSON.parse(saved);}
        currentview=[...arr];
        display(arr);
        checkExpire();
};

