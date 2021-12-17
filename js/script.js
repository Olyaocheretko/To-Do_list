const url = 'https://jsonplaceholder.typicode.com/todos'
const requiredUserIds = [2, 4, 6]
const requiredToDoListItems = 5
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

      filteredToDoList = getFilteredArray(toDoList, requiredUserIds, requiredToDoListItems)
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
  clearToDos()

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
      liLast.id = `li-${userId}_${userGroup[i].id}`
      liLast.innerHTML = `
        <input type="text" disabled="disabled" class="list__input list__column" id="input-${userGroup[i].id}" value="${userGroup[i].title}">               
        <div class="list__buttons list__column">
            <a href="#" class="list__button list__button-med btn _btn-remove" data-id="${userGroup[i].id}">Remove</a>  
            <a href="#" class="list__button list__button-med btn _btn-edit" data-id="${userGroup[i].id}">Edit</a>       
        </div>
      `
      olItem.append(liLast)
    }

    addNewItemOnClick()
    addEditToDoOnClick()
    addRemoveToDoOnClick()
  })
}

function clearToDos() {
  let containerToDos = document.getElementById('containerToDos')
  if (containerToDos) {
    containerToDos.remove()
  }
}

function addNewItemOnClick() {
  const buttons = document.querySelectorAll('.list__button')

  buttons.forEach(function (button) {
    button.onclick = function (event) {
      event.preventDefault();
      this.nextElementSibling.classList.toggle('_active')
    }
  })//TODO: realise onclick on Add button
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
      title: `${item.title}`
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

      deleteToDoItem(itemId)
    }
  })
}

function deleteToDoItem(itemId) {
  const url = `https://jsonplaceholder.typicode.com/todos/${itemId}`
  fetch(url, {
    method: 'DELETE'
  })
      .then((response) => response.json())
      .then(() => {
        filteredToDoList = deleteToDoItemFromFilteredArray(filteredToDoList, itemId)
        renderToDoList(filteredToDoList)
      })
}

function deleteToDoItemFromFilteredArray(groupedToDoList, itemId) {
  groupedToDoList.forEach (function (userGroup) {
    userGroup.forEach (function (toDoItem, index) {
      if (toDoItem.id === +itemId) {
        userGroup.splice(index,1)
      }
    })
  })
  return groupedToDoList
}





