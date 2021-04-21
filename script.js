const BtnRender = document.querySelector('.btn-render')

const InputName = document.querySelector('input[name=name]')
const InputMajors = document.querySelector('input[name=majors]')
const InputHobby = document.querySelector('input[name=hobby]')
const InputHidden = document.querySelector('input[name=id_student]')

const UpdateInputName = document.querySelector('input[name=update_name]')
const UpdateInputMajors = document.querySelector('input[name=update_majors]')
const UpdateInputHobby = document.querySelector('input[name=update_hobby]')

const FormAdd = document.querySelector('.form-add')
const FormUpdate = document.querySelector('.form-update')
const TBody = document.querySelector('tbody')

window.onload = () => {
    renderStudents()
}

let url = 'http://localhost:3000/api/v1'

// delete
document.addEventListener('click', function(e){

    if( e.target.classList.contains('btn-delete') ){
        
        if( !confirm('are you sure?') ){
            return
        }

        const id = e.target.dataset.id

        fetch(url + `/delete/${id}`, { 
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(result => {
            
            showMessage(result.message, 'success')
            renderStudents()

        })
    }
})


// update
FormUpdate.addEventListener('submit', async function(e) {
    e.preventDefault()

    const id = InputHidden.value

    const data = {
        name: UpdateInputName.value,
        majors: UpdateInputMajors.value,
        hobby: UpdateInputHobby.value,
    }

    fetch(url + `/update/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {

        showMessage(result.message, 'success')
        $('#modal-update').modal('hide')
        renderStudents()
    
    })
})


document.addEventListener('click', async function(e){
    if( e.target.classList.contains('btn-update') ){
        const id = e.target.dataset.id

        const { data: student } = await getStudents(url + `/student/${id}`)

        $('#modal-update').modal('show')
        UpdateInputName.value = student.name
        UpdateInputMajors.value = student.majors
        UpdateInputHobby.value = student.hobby
        InputHidden.value = student.id
    }
})


// add 
FormAdd.addEventListener('submit', async function(e) {
    e.preventDefault()

    const data = {
        name: InputName.value,
        majors: InputMajors.value,
        hobby: InputHobby.value,
    }

    fetch(url + '/create', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        showMessage(result.message, 'success')
        $('#modal-add').modal('hide')
        renderStudents()
    })
})


// render data
async function renderStudents(){
    let tr = ''

    const { data: students } = await getStudents(url + '/students')

    students.forEach((student, index) => {
        tr += `
        <tr>
            <th scope="row">${index + 1}</th>
            <td>${student.name}</td>
            <td>${student.majors}</td>
            <td>${student.hobby}</td>
            <td>
                <button class="btn btn-danger btn-delete" data-id="${student.id}">Delete</button>
                <button class="btn btn-info btn-update" data-id="${student.id}">Update</button>
            </td>
        </tr>`
    })

    TBody.innerHTML = tr
}


// re render data
BtnRender.addEventListener('click', function(e){
    e.preventDefault()
    TBody.innerHTML = ''
    renderStudents()
})


// fetch data
function getStudents(url){
    return fetch(url).then(response => response.json()).then(result => result)
}


// show message
function showMessage(msg, type){
    const alert = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
    <strong>${msg}</strong>
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>`

  document.querySelector('.alert-container').innerHTML = alert
}


// modal on hide
$('#modal-add').on('hide.bs.modal', function(){
    InputName.value = ''
    InputMajors.value = ''
    InputHobby.value = ''
})

$('#modal-update').on('hide.bs.modal', function(){
    UpdateInputName.value = ''
    UpdateInputMajors.value = ''
    UpdateInputHobby.value = ''
})