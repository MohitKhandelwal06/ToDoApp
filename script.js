const addbtn=document.querySelector('.add-btn');
const modal=document.querySelector('.modal-cont');

let isModalVisible=false;
addbtn.addEventListener('click', function(){
    if(!isModalVisible){
        modal.style.display='flex';
    }else{
        modal.style.display='none';
    }
    isModalVisible=!isModalVisible;
});

let allPriorityColors=document.querySelectorAll('.priority-color');

allPriorityColors.forEach(function(colorElement){
    colorElement.addEventListener('click',function(){
        allPriorityColors.forEach(function(priorityColorElement){
            priorityColorElement.classList.remove('active');
        });
        colorElement.classList.add('active');
    });
});