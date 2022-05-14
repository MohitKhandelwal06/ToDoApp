const addbtn=document.querySelector('.add-btn');
const modal=document.querySelector('.modal-cont');
let allPriorityColors=document.querySelectorAll('.priority-color');
let colors = ['lightpink', 'lightgreen', 'lightblue', 'black'];
let modalPriorityColor = colors[colors.length - 1]; //black
let textAreaCont = document.querySelector(".textarea-cont");

const mainCont = document.querySelector(".main-cont");


let ticketsArr=[];
var uid = new ShortUniqueId();

let toolBoxColors = document.querySelectorAll(".color");

let isModalVisible=false;
addbtn.addEventListener('click', function(){
    if(!isModalVisible){
        modal.style.display='flex';
    }else{
        modal.style.display='none';
    }
    isModalVisible=!isModalVisible;
});



allPriorityColors.forEach(function(colorElement){
    colorElement.addEventListener('click',function(){
        allPriorityColors.forEach(function(priorityColorElement){
            priorityColorElement.classList.remove('active');
        });
        colorElement.classList.add('active');
        modalPriorityColor=colorElement.classList[0];
    });
});


modal.addEventListener("keydown", function (e) {
    let key = e.key;
    if (key == "Shift") {
      console.log(modalPriorityColor);
      console.log(textAreaCont.value);
      createTicket(modalPriorityColor, textAreaCont.value);
      modal.style.display = "none";
        isModalVisible = false;
        textAreaCont.value = "";
        allPriorityColors.forEach(function (colorElem) {
            colorElem.classList.remove("active");
        })
    }
});

function createTicket(ticketColor,text,ticketId){
    let id =ticketId || uid();
    let ticketCont=document.createElement('div');
    ticketCont.setAttribute('class','ticket-cont');
    ticketCont.innerHTML=`
        <div class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id">${id}</div>
        <div class="task-area">${text}</div>
    `;
    mainCont.appendChild(ticketCont);


    if(!ticketId){
        ticketsArr.push({ticketColor,text,ticketId : id});
        localStorage.setItem("tickets",JSON.stringify(ticketsArr));
    }
}

// get all tickets from local storage
if(localStorage.getItem("tickets")){
    ticketsArr=JSON.parse(localStorage.getItem("tickets"));
    ticketsArr.forEach(function(ticketObj){
        createTicket(ticketObj.ticketColor,ticketObj.text,ticketObj.ticketId);
    })
}


// filter tickets on the basis of ticket color
for(let i=0;i<toolBoxColors.length;i++){
    toolBoxColors[i].addEventListener("click",function(){
        let currentToolBoxColor=toolBoxColors[i].classList[0];

        let filteredTickets=ticketsArr.filter(function(ticketObj){
            return currentToolBoxColor==ticketObj.ticketColor;
        });

        // remove all tickets from screen
        let allTickets = document.querySelectorAll(".ticket-cont");
        for (let i = 0; i < allTickets.length; i++){
            allTickets[i].remove();
        }

        // display filtered tickets
        filteredTickets.forEach(function(ticketObj){
            createTicket(ticketObj.ticketColor,ticketObj.text,ticketObj.ticketId);
        })
    });


    toolBoxColors[i].addEventListener("dblclick",function(){
        let allTickets=document.querySelectorAll(".ticket-cont");
        // remove all from screen
        allTickets.forEach(function(ticketObj){
            ticketObj.remove();
        });

        // show all tickets
        ticketsArr.forEach(function(ticketObj){
            createTicket(ticketObj.ticketColor,ticketObj.text,ticketObj.ticketId);
        });
    });
}


