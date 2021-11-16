var addTodoButton = $("#addTodo")
var clearTodosButton = $("#clearTodos")

var clearTodosButton = $("#clearTodos")
var todoList = $("#todoList")
var todoDisplay = $("#todoMessage")

const todoInputs = {
    text: $("#todoTextInput"),
    time: $("#todoTimeInput"),
}

//initial
addTodoButton.click(); clearTodosButton.click();
loadTodoElementBackups(todoList);

//on addTodoButton.click, edit todoDisplay content by adding a todo
addTodoButton.click(function (event) {
    let todo = {
        text: todoInputs.text,
        time: todoInputs.time,
    }
    let text_field = todoInputs.text.parent()

    //check if input values follow certain conditions (whether there is a todo text, and if the object isn't empty)
    if (todo.text.val().length > 0) {
        if (text_field.hasClass("error")) {text_field.removeClass("error"); todo.text.attr("placeholder", "")}
        //return code for successful todo
        addTodo(todoList, todo)
        console.log(`created ${todo}`)
    } else {
        text_field.addClass("error")
        todo.text.attr("placeholder", "Please add some text to display.")
    }
})

//when clearTodoButton is pressed, runs .empty() on todoList which deletes it's children
clearTodosButton.click(function (event) {
    todoList.empty()
    backupTodoElements(todoList)
})



function addTodo(list, todo){
    let todo_element = createTodoElement(todo)
    list.append(todo_element)
    backupTodoElements(list)
}

function createTodoElement(todo){
    let todoElem = $(
        `<div class="item" name="todo" style="cursor: pointer; word-wrap: break-word;"></div>`);
        todoElem.click(function(event) {onTodoClick(event)})
        todoElem.hover(function(event) {onTodoHover(event)})
        todoElem.append(`   
                                <div class="header">${todo.text.val()}</div> 
                                <p style= "color: black">${todo.time.val()}</p>
                            `)
    return todoElem

    //* todo_item html structure
    {/* <div class="content">
            <div class="header">Snickerdoodle</div>
            An excellent companion
        </div> */}
}

function backupTodoElements(list){
    chrome.storage.sync.set({"todoList": list.html()}, function() {console.log(`saved todoList as ${list.html()}`)})
}

function loadTodoElementBackups(list) {
    chrome.storage.sync.get("todoList", function (data) {
        if (typeof data.todoList !== 'undefined') {
            list.html(data.todoList)

            let todos = list.children();
            todos.click(function(event) {onTodoClick(event)})
            todos.hover(function(event) {onTodoHover(event)})
        }
    })
}

//HEADER: EVENTS
function onTodoClick(event) {
    //get the element that user clicked on
    //! THIS IS VERY STUPID, DO NOT LOOK AT UNLESS YOU WANT A HEADACHE
    let clickedElem = $(event.target)

    //*when you add an onClick event to an html element it adds it to all its children
    //*so if u accidently click one of its children it activates the script
    //*SO I HAVE TO DO THIS WIERD STUPID IF STATEMENT BSBBSBSBBSBS
    if (clickedElem.attr("name") !== "todo") { clickedElem = clickedElem.parent() }
    clickedElem.remove()
    backupTodoElements($("#todoList"))
}

function onTodoHover(event) {
    //*SAME GODDAMN THING AS IN onTodoClick >:C
    let hoveredElem = $(event.target)
    if (hoveredElem.attr("name") !== "todo") {hoveredElem = hoveredElem.parent()}
    hoveredElem.toggleClass("todo-delete")
}
