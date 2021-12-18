const url = 'https://jsonplaceholder.typicode.com/todos'
const requiredUserIds = [2, 4, 6]
const requiredToDoListItemsQuantity = 5
let filteredToDoList = []

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

      filteredToDoList = getFilteredArray(toDoList, requiredUserIds, requiredToDoListItemsQuantity)
      renderToDoList(filteredToDoList)
    }
  }
}

function getFilteredArray(toDoList, requiredUserIds, requiredToDoListItemsQuantity) {
  let filteredArrayOfUsers = []
  for(let i = 0; i < requiredUserIds.length; i++) {
    filteredArrayOfUsers.push(toDoList.filter(item => item.userId === requiredUserIds[i]).slice(0,requiredToDoListItemsQuantity))
  }
  return filteredArrayOfUsers
}

function renderToDoList(filteredArray) {
  let container = document.createElement('div')
  document.body.append(container)
  container.className = `container`
  container.id = 'containerToDos'

  filteredArray.forEach(function (userGroup) {
    let userId = userGroup[0].userId
    let toDoBlock = document.createElement('form')
    toDoBlock.className = `list`
    toDoBlock.innerHTML = `
      <h2 class="list__title">To-Do list for user № ${userId}</h2>
      <a href="#" class="list__button btn _btn-add" data-user_id="${userId}">Add new Item</a>
      <div class="list__row list__row-new" id="div-${userId}">
        <textarea class="list__input list__column" autocomplete="off" id="textarea-${userId}"></textarea>
        <button type="submit" class="list__button-small btn list__column" id="button-${userId}">Add</button>
      </div>
      <ol class='list__body' id="list__body-${userId}"></ol>
    `
    container.append(toDoBlock)

    renderUserToDoItems(userId, userGroup)
    addNewItemOnClick()
  })
}

function renderToDoItems(userGroup, userId) {
  for (let i = 0; i < userGroup.length; i++) {
    let olItem = document.getElementById(`list__body-${userId}`)
    let liLast = document.createElement('li')
    liLast.className = `list__row list__item-${userId}`
    liLast.innerHTML = `
        <input type="text" disabled="disabled" class="list__input list__column" id="input-${userGroup[i].id}" value="${userGroup[i].title}">               
        <div class="list__buttons list__column">
            <a href="#" class="list__button list__button-med btn _btn-remove" data-id="${userGroup[i].id}" data-userId="${userId}">Remove</a>  
            <a href="#" class="list__button list__button-med btn _btn-edit" data-id="${userGroup[i].id}">Edit</a>       
        </div>
    `
    olItem.append(liLast)
  }
}

function addNewItemOnClick() {
  const buttons = document.querySelectorAll('._btn-add')

  buttons.forEach(function (button) {
    button.onclick = function (event) {
      event.preventDefault();
      let userId = +this.dataset.user_id
      let div = document.getElementById(`div-${userId}`)
      let textarea =  document.getElementById(`textarea-${userId}`)
      let addButton =  document.getElementById(`button-${userId}`)
      let userGroup = filteredToDoList[requiredUserIds.indexOf(+userId)]

      if(div.classList.contains('_active')) {
        div.classList.remove('_active')
      }
      else {
        div.classList.add('_active')
        addNewToDoOnClick(userId, addButton, textarea, userGroup)
      }
    }
  })
}

function addNewToDoOnClick(userId, addButton, textarea, userGroup) {
  addButton.onclick = function (event) {
    event.preventDefault();
    let item = {
      userId: userId,
      id: userGroup.length + 1,
      title: textarea.value,
      completed: false
    }
    userGroup.unshift(item)
    addToDoItem(item, userGroup, userId)
  }
}

function addToDoItem(item, userGroup, userId) {
  const url = `https://jsonplaceholder.typicode.com/todos`

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: item.userId,
      id: item.id,
      title: item.title,
      completed: item.completed
    })
  })
      .then((response) => response.json())
      .then(() => {
        renderUserToDoItems(userId, userGroup)
      })
}

function clearToDoItems(userId) {
  let toDos = document.querySelectorAll(`.list__item-${userId}`)

  toDos.forEach(function (toDo) {
    if (toDo) {
      toDo.remove()
    }
  })
}

function addEditToDoOnClick() {
  const editButtons = document.querySelectorAll('._btn-edit')

  editButtons.forEach (function (editButton) {
    editButton.onclick = function (event) {
      event.preventDefault();
      let itemId = this.dataset.id
      let input = document.getElementById(`input-${itemId}`)

      if (input.disabled) {
        input.disabled = ''
        input.classList.add('_active')
        input.focus()
      }
      else {
        input.disabled = 'disable'
        input.classList.remove('_active')
        let item = {
          title: input.value
        }

        updateToDoItem(itemId, item)
      }
    }
  })
}

function updateToDoItem(itemId, item) {
  const url = `https://jsonplaceholder.typicode.com/todos/${itemId}`
  let result

  fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: item.title
    })
  })
      .then((response) => response.json())
      .then((response) => result = response)
}

function addRemoveToDoOnClick() {
  const removeButtons = document.querySelectorAll('._btn-remove')

  removeButtons.forEach (function (removeButton) {
    removeButton.onclick = function (event) {
      event.preventDefault();
      let itemId = this.dataset.id
      let userId = this.dataset.userid

      deleteToDoItem(itemId, userId)
    }
  })
}

function deleteToDoItem(itemId, userId) {
  const url = `https://jsonplaceholder.typicode.com/todos/${itemId}`

  fetch(url, {
    method: 'DELETE'
  })
      .then((response) => response.json())
      .then(() => {
        let updatedUserGroup = deleteToDoItemFromFilteredArray(itemId)
        renderUserToDoItems(userId, updatedUserGroup)
      })
}

function deleteToDoItemFromFilteredArray(itemId) {
  let updatedUserGroup
  filteredToDoList.forEach (function (userGroup) {
    userGroup.forEach (function (toDoItem, index) {
      if (toDoItem.id === +itemId) {
        userGroup.splice(index, 1)
        updatedUserGroup = userGroup
      }
    })
  })
  return updatedUserGroup
}

function renderUserToDoItems(userId, userGroup) {
  clearToDoItems(userId)
  renderToDoItems(userGroup, userId)
  addEditToDoOnClick()
  addRemoveToDoOnClick()
}




