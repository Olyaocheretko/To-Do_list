const url = 'https://jsonplaceholder.typicode.com/todos'
const requiredUserIds = [2, 4, 6]
const requiredToDoListItems = 5

window.onload = function() {
  showToDoList(url)
}

function showToDoList(url) {
  const getRequest = new XMLHttpRequest
  getRequest.open('GET',url)
  getRequest.setRequestHeader('Content-Type', 'application/json')
  getRequest.responseType = 'json'
  getRequest.send()

  getRequest.onload = function(event) {
    let message = event.target.status >= 300 ? `Something went wrong` : 'Your request has been loaded'
    console.log(message)
  }
  getRequest.onerror = function(event) {
    console.log (`Something went wrong. Status is: ${this.status}`)
  }
  getRequest.onreadystatechange = function(event) {
    if(event.target.readyState === 4) {
      let toDoList = this.response

      let filteredToDoList = getFilteredArray(toDoList, requiredUserIds, requiredToDoListItems)
      renderToDoList(filteredToDoList)
    }
  }
}

function getFilteredArray(toDoList, requiredUserIds, requiredToDoListItems) {
  let filteredArrayOfUsers = []
  for(let i = 0; i < requiredUserIds.length; i++) {
    filteredArrayOfUsers.push(toDoList.filter(item => item.userId === requiredUserIds[i]).slice(0,requiredToDoListItems))
  }

  return filteredArrayOfUsers
}

function renderToDoList(filteredArray) {
  let container = document.createElement('div')
  document.body.append(container)
  container.className = `container`

  filteredArray.forEach(function (userGroup) {
    let userId = userGroup[0].userId

    let toDoBlock = document.createElement('form')
    toDoBlock.className = `list`
    toDoBlock.innerHTML = `
      <h2 class="list__title">To-Do list for user № ${userId}</h2>
      <a href="#" class="list__button btn">Add new Item</a>
      <div class="list__row list__row-new">
        <textarea class="list__input list__column" autocomplete="off"></textarea>
        <button type="submit" class="list__button-small btn list__column">Add</button>
      </div>
      <ol class='list__body list__body-${userId}'></ol>
    `
    container.append(toDoBlock)

    for (let i = 0; i < userGroup.length; i++) {
      let olItem = document.querySelector(`.list__body-${userId}`)

      let liLast = document.createElement('li')
      liLast.className = 'list__row'
      liLast.innerHTML = `
        <input type="text" disabled="disabled" class="list__input list__column" value="${userGroup[i].title}">
        <div class="list__buttons list__column">
            <a href="#" class="list__button list__button-med btn _btn-remove">Remove</a>
            <a href="#" class="list__button list__button-med btn _btn-edit">Edit</a>
        </div>
      `
      olItem.append(liLast)
    }

    showNewItemBlock()
  })
}

function showNewItemBlock() {
  const buttons = document.querySelectorAll('.list__button')

  buttons.forEach (function (button) {
    for (let index = 0; index < buttons.length; index++) {
      let button = buttons[index]

      button.onclick = function(event) {
        event.preventDefault();
        this.nextElementSibling.classList.toggle('_active')
      }
    }
  })
}
