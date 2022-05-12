const addbtn=document.querySelector('.add-btn');
const modal=document.querySelector('.modal-cont');
let allPriorityColors=document.querySelectorAll('.priority-color');
let colors = ['lightpink', 'lightgreen', 'lightblue', 'black'];
let modalPriorityColor = colors[colors.length - 1]; //black
let textAreaCont = document.querySelector(".textarea-cont");

const mainCont = document.querySelector(".main-cont");




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

function createTicket(ticketColor,text){
    let ticketCont=document.createElement('div');
    ticketCont.setAttribute('class','ticket-cont');
    ticketCont.innerHTML=`
        <div class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id"></div>
        <div class="task-area">${text}</div>
    `;
    mainCont.appendChild(ticketCont);
}