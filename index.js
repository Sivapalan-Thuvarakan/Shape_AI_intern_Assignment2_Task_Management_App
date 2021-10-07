let globalTaskData = [];
teskContents = document.getElementById("taskContents");


const addCard = () => {
    const newTaskDetails ={
        id: `${Date.now()}`,//template literal are used here to declare variable 
        url: document.getElementById("imageURL").value,
        title: document.getElementById("taskTitle").value,
        type: document.getElementById("taskType").value,
        description: document.getElementById("taskDescription").value
    }

    //insert adjacent method is used to add html element according to corresponding specified html element
    // 1.before begin
    // 2.after begin
    // 3.before end
    // 4.after end

    taskContents.insertAdjacentHTML('beforeend',generateTaskCard(newTaskDetails))

    globalTaskData.push(newTaskDetails);
    saveToLocalStorage();
}
   
//object destructuring

const generateTaskCard =  ({id, url, title, type, description}) => 
           //template literal
        ` <div class="col-md-6 col-lg-4 mt-3" id=${id} key=${id}>
            <div class="card"> 
                <div class="card-header">
                    <div class="d-flex justify-content-end">
                        <button type="button" class="btn btn-outline-info mr-2" name=${id} onclick="editTask.apply(this, arguments)">
                            <i class="fas fa-pencil-alt"name=${id}></i>
                        </button>
                        <button class="btn btn-outline-danger" name=${id} onclick="deleteTask.apply(this,arguments)">
                            <i class="fa fa-trash" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
                <div class="card__body__image">
                    <img src=${url} class="card-img-top" alt="img1"/>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${description}</p>
                    <span class="badge bg-warning" style="color:black;">${type}</span>
                </div>
                <div class="card-footer">
                    <button class="btn btn-outline-dark float-end">OPEN TASK</button>
                </div>
            </div>
        </div>`
    
//JSON-Java Script Object Notation -> string format javascript object

const saveToLocalStorage = () => {
    localStorage.setItem("tasky",JSON.stringify({tasks: globalTaskData}))
}

const reloadTaskList = () => {
    const localStorageCopy = JSON.parse(localStorage.getItem("tasky"));
    if(localStorageCopy){
        globalTaskData = localStorageCopy.tasks;//localStorageCopy["tasks"]
    }

    globalTaskData.map((cardData)=>{
        taskContents.insertAdjacentHTML('beforeend',generateTaskCard(cardData));
    })
}

const deleteTask = (e) =>{
    console.log(e);
    const targetID = e.target.getAttribute("name");
    console.log(targetID);
    
    const type = e.target.tagName;
    console.log(type);
    globalTaskData= globalTaskData.filter((card)=> card.id!==targetID);
    saveToLocalStorage();
    window.location.reload();
}

////////////////////////////////////////////////////need to concern/////////////////////////////////////////////////////////////

const editTask = (e) => {
    if (!e) e = window.event;
    const targetID = e.target.id;
    const type = e.target.tagName;
    let parentNode;
    let taskTitle;
    let taskDescription;
    let taskType;
    let submitButton;
    if (type === "BUTTON") {
      parentNode = e.target.parentNode.parentNode;
    } else {
      parentNode = e.target.parentNode.parentNode.parentNode;
    }
    taskTitle = parentNode.childNodes[3].childNodes[3];
    taskDescription = parentNode.childNodes[3].childNodes[5];
    submitButton = parentNode.childNodes[5].childNodes[1];
    taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
  
    taskTitle.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");
    submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
    submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
    submitButton.removeAttribute("data-bs-toggle");
    submitButton.removeAttribute("data-bs-target");
    submitButton.innerHTML = "Save Changes";
  };
  const saveEdit = (e) => {
    if (!e) e = window.event;
    const targetID = e.target.id;
    const parentNode = e.target.parentNode.parentNode;
    console.log(parentNode.childNodes);
    const taskTitle = parentNode.childNodes[3].childNodes[3];
    const taskDescription = parentNode.childNodes[3].childNodes[5];
    const submitButton = parentNode.childNodes[5].childNodes[1];
    const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    const updateData = {
      taskTitle: taskTitle.innerHTML,
      taskDescription: taskDescription.innerHTML,
      taskType: taskType.innerHTML,
    };
  
    let stateCopy = state.taskList;
    stateCopy = stateCopy.map((task) =>
      task.id === targetID
        ? {
            id: task.id,
            title: updateData.taskTitle,
            description: updateData.taskDescription,
            type: updateData.taskType,
            url: task.url,
          }
        : task
    );
  
    state.taskList = stateCopy;
    updateLocalStorage();
    taskTitle.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");
    submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
    submitButton.setAttribute("data-bs-toggle", "modal");
    submitButton.setAttribute("data-bs-target", "#showTask");
    submitButton.innerHTML = "Open Task";
  };
  
  const searchTask = (e) => {
    if (!e) e = window.event;
    while (taskContents.firstChild) {
      taskContents.removeChild(taskContents.firstChild);
    }
  
    const resultData = state.taskList.filter(({ title }) =>
      title.includes(e.target.value)
    );
  
    resultData.map((cardData) => {
      taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
    });
  };