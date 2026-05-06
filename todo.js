 let arr=[];
 let endIndex=-1;
let sortedarr=[];
let currentview=[];
let currentrow=5;
let startpage=1;
const check=/^\w+(?:\s\w+)*$/;
const datefield=document.getElementById("date");
const taskfield=document.getElementById("task");
const descfield=document.getElementById("desc");
const duefield=document.getElementById("due_Date");
const timefield=document.getElementById("Time");
const submitbtn=document.getElementById("submit");
const required=[datefield,taskfield,duefield,timefield];
function checkfield(){
 if(!(check.test(taskfield.value))){
    submitbtn.disabled=true;
    return;
 }
    submitbtn.disabled=!required.every(t=>t.value.trim()!=='');
}
required.forEach(t=>{
    t.addEventListener('input',checkfield);
    t.addEventListener('change',checkfield);
});
checkfield();
$(document).ready(function(){
    $('#date').Zebra_DatePicker({
        format:'d-m-y',
        onSelect:function(view,elements){
            checkfield();
        }
     } );
   });
 $(document).ready(function(){
            $('#due_Date').Zebra_DatePicker({
                format:'d-m-y',
                onSelect:function(view,elements){
            checkfield();
        }
            });
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

if(!(check.test(task))){
    alert("Task only contain Alphabet,Number and Space between word");
    return;
}
if(new Date(due)<new Date(date)){
    alert("Due Date must be higher than Date");
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
    array.forEach((todo,index) => {
       
     const data=document.createElement("div");
     data.className="row";
    data.innerHTML=`
    
    <div class="box1"><span>Date: ${todo.date}</span><span>Due Date:   ${todo.due}</span><span> Time:  ${todo.time}</span></div>
       
        <div class="box2">Task: ${todo.task} <br></div>
        <div class="box3">Description: ${todo.desc}</div>
        <div class="box4">
         <select onchange="update_status(${index},this.value)" class="drop">
        <option ${todo.status === 'Pending' ? 'selected' : ''}>Pending</option>
        <option ${todo.status=== 'Completed'? 'selected' : ''}>Completed</option>
        </select></div>
   
   <div class="button">
        <button onclick="edit(${index})" class="btn">Edit</button>
        <button onclick="Delete(${index})" class="btn">Delete</button>
        </div>
        `;
       final.append(data);});
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
        <option ${todo.status=== 'Completed'? 'selected' : ''}>Completed</option>
        </select></td> <td> ${todo.desc}</td> <td>  ${todo.due}</td><td>   ${todo.time}</td>
   <td>
        <button onclick="edit(${realindex})" class="btn">Edit</button></td>
       <td> <button onclick="Delete(${realindex})" class="btn">Delete</button></td>
        
        ` ; body.appendChild(data);
    });
    final.appendChild(table);
    renderPage();
       
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

display(currentview);
checkfield();
}



function update_status(index,value){
    arr[index].status=value;
    SaveLocal();
display(arr);
}

document.getElementById("sortbtn").addEventListener('click',sort_filter);
document.getElementById("filterbtn").addEventListener('click',sort_filter);
function sort_filter(){
     if(arr.length==0){
        alert("No filter can be Done for Below Data");
        return;
    }
    const choice=document.getElementById("choose").value;
    if(choice==="All"){
      currentview=[...arr];
    }else{
   currentview= arr.filter(fil=>fil.status===choice)
    }
    if(currentview.length==0){
        alert("No Sort can be Done for Below Data");
        return;
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
    
};

