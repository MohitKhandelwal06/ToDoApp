const addbtn=document.querySelector('.add-btn');
const modal=document.querySelector('.modal-cont');
let allPriorityColors=document.querySelectorAll('.priority-color');
let colors = ['lightpink', 'lightgreen', 'lightblue', 'black'];
let modalPriorityColor = colors[colors.length - 1]; //black
let textAreaCont = document.querySelector(".textarea-cont");

const mainCont = document.querySelector(".main-cont");
let removeBtn= document.querySelector(".remove-btn");
// let lockBtn=document.querySelectorAll(".edit-lock");

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
// creates a ticket and show it on screen
function createTicket(ticketColor,text,ticketId){
    let id =ticketId || uid();
    let ticketCont=document.createElement('div');
    ticketCont.setAttribute('class','ticket-cont');
    ticketCont.innerHTML=`
        <div class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id">${id}</div>
        <div contenteditable=false class="task-area" >${text}
        </div>
        <div class="edit-lock">Click on lock to edit &nbsp&nbsp&nbsp<i class="fa-solid fa-lock"></i> </div>        
    `;
    mainCont.appendChild(ticketCont);
    handleRemoval(ticketCont,id);
    handleColor(ticketCont,id);
    handleLock(ticketCont,id);

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

    // On double clicking Any color, show all the tickets again
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

// on clicking removeBtn make color red and on clicking it again make it white
let removeBtnActive=false;
removeBtn.addEventListener("click",function(){
    if(!removeBtnActive){
        removeBtn.style.color="red";
    }else{
        removeBtn.style.color="white";
    }
    removeBtnActive=!removeBtnActive;
});

// Removes a ticket from local storage and UI
function handleRemoval(ticket,id){
    ticket.addEventListener('click',function(){
        if(!removeBtnActive){
            return ;
        }

        let idx=getTicketIdx(id); // get index of the ticket to be removed
        ticketsArr.splice(idx,1);

        localStorage.setItem("tickets",JSON.stringify(ticketsArr));
        // removed from browser storage and updated ticketsArr

        ticket.remove();
        // removed from frontend
    });
}

// return the idx of the ticket, of the given ticket id
function getTicketIdx(id){
    let ticketIdx=ticketsArr.findIndex(function(ticketObj){
        return ticketObj.ticketId==id;
    });
    return ticketIdx;
}

// Change priority colors of the tickets.
function handleColor(ticket,id){
let ticketColorStrip=ticket.querySelector('.ticket-color');

    ticketColorStrip.addEventListener('click',function(){
        let currTicketColor=ticketColorStrip.classList[1];

        let currTicketColorIdx=colors.indexOf(currTicketColor);

        let newTicketColorIdx=currTicketColorIdx+1;
        newTicketColorIdx=newTicketColorIdx%colors.length;

        let newTicketColor=colors[newTicketColorIdx];
        ticketColorStrip.classList.remove(currTicketColor);
        ticketColorStrip.classList.add(newTicketColor);

        let idx=getTicketIdx(id);
        ticketsArr[idx].ticketColor=newTicketColor;
        localStorage.setItem("tickets",JSON.stringify(ticketsArr));

    });
}
// let lockBtnActive=fales;
// lockBtn.addEventListener('click',function(){
//     if(!lockBtnActive){
//         lockBtn.innerText=`Click on button after editing &nbsp&nbsp&nbsp<i class="fa-solid fa-lock-open"></i>`;
//     }else{
//         lockBtn.innerText=`Click on lock to edit &nbsp&nbsp&nbsp<i class="fa-solid fa-lock"></i>`;
//     }
//     lockBtnActive=!lockBtnActive;
// });
function handleLock(ticket,id){
    let lockBtn=ticket.querySelector(".edit-lock");
    let taskArea=ticket.querySelector(".task-area");
    let lockBtnActive=false;
    lockBtn.addEventListener('click',function(){
        if(!lockBtnActive){
            lockBtn.innerHTML=`Click on lock after editing &nbsp&nbsp&nbsp<i class="fa-solid fa-lock-open"></i>`;
            taskArea.contentEditable=true;
        }else{
            lockBtn.innerHTML=`Click on lock to edit &nbsp&nbsp&nbsp<i class="fa-solid fa-lock"></i>`;
            taskArea.contentEditable=false;
            let newText=taskArea.innerText;
            let idx=getTicketIdx(id);
            ticketsArr[idx].text=newText;
            localStorage.setItem("tickets",JSON.stringify(ticketsArr));
        }
        lockBtnActive=!lockBtnActive;
    });
}


let howToUse=document.querySelector(".howToUseButton");
let howToUsePopUp=document.querySelector(".howToUsePopUp");
let dismisButton=document.querySelector(".dismis");
let isActive=false;
howToUse.addEventListener('click',function(){
    if(!isActive){
        howToUsePopUp.style.display="block";
    }else{
        howToUsePopUp.style.display="none";
    }
    isActive=!isActive;
});

dismisButton.addEventListener('click',function(){
    howToUsePopUp.style.display="none";
});