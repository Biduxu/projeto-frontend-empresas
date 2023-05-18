import{getDepartmentsList} from "./api.js";

export async function modalEdit(button){
    
    button.addEventListener("click", (e)=>{
        const body = document.querySelector("body")

        const sectionModal = document.createElement("section")
        sectionModal.classList = "section-modal flex items-center justify-center"

        const buttonClose = document.createElement("button")
        buttonClose.innerText = "X"
        buttonClose.classList = "button-close-modal"

        const divModal = document.createElement("div")
        divModal.classList = "div-modal flex column items-end"

        body.appendChild(sectionModal)
        sectionModal.appendChild(divModal)

        let divTitleForm = document.createElement("div")
        divTitleForm.classList = "div-title-form flex column gap-1 width-100"

        let titleModal = document.createElement("h1")
        titleModal.innerText = "Editar Perfil"

        let formEdit = document.createElement("form")
        formEdit.classList = "form-edit flex column gap-4"

        let inputName = document.createElement("input")
        inputName.placeholder = "Seu nome"
        inputName.type = "text"
        inputName.id = "username"
        inputName.name = "nome"
        let inputEmail = document.createElement("input")
        inputEmail.placeholder = "Seu e-mail"
        inputEmail.type = "email"
        inputEmail.id = "email"
        inputEmail.name = "e-mail"
        let inputPassword = document.createElement("input")
        inputPassword.placeholder = "Sua senha"
        inputPassword.type = "password"
        inputPassword.id = "password"
        inputPassword.name = "senha"
        let buttonEdit = document.createElement("button")
        buttonEdit.innerText = "Editar perfil"
        buttonEdit.classList = "button-edit"
        buttonEdit.type = "submit"

        formEdit.append(inputName, inputEmail, inputPassword, buttonEdit)

        divTitleForm.append(titleModal, formEdit)

        divModal.append(buttonClose, divTitleForm)

        closeModal(buttonClose)
        getDataUpdateFromInputs()
    })
}

function closeModal(button){

    let sectionModal = document.querySelector(".section-modal")

    button.addEventListener("click", (e)=>{
        sectionModal.remove()
    })
}


async function updateDataUser (token, data){
    try{
        const request = await fetch("http://localhost:6278/users", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })

        const response = await request.json()
        return response

    } catch(err){
        
        return err
    }
}

function getDataUpdateFromInputs (){
    const formEdit = document.querySelector(".form-edit")

    let elementsForm = [...formEdit.elements]

    const tokenObj = JSON.parse(localStorage.getItem("token"))

    const token = tokenObj.token

    formEdit.addEventListener("submit", async (e)=>{
        e.preventDefault()

        const dataUpdate = {}
        let numberAux = 0

        elementsForm.forEach((elementHTML)=>{
            if(elementHTML.tagName == "INPUT" && elementHTML.value == ""){
                elementHTML.classList = "input-alert"

                let spanAlert = document.createElement("span")
                spanAlert.innerText = `Preencha o campo ${elementHTML.name}` 
                spanAlert.classList = "span-alert"
                
                formEdit.append(spanAlert)
            } else {
                if(elementHTML.tagName !== "BUTTON"){
                    dataUpdate[elementHTML.id] = elementHTML.value
                    numberAux++
                }
            }
        })

        if(numberAux == 3){
            let response = await updateDataUser(token, dataUpdate)

            if (response.error){
                let spanAlert = document.createElement("span")
                spanAlert.innerText = "Esse e-mail já existe!"
                spanAlert.classList = "span-alert"

                formEdit.append(spanAlert)
            } else {
                window.location.reload()
            }
            
        }
    })
}

export function modalHireUser (button){
    button.addEventListener("click", async (e)=>{
        const tokenObj = JSON.parse(localStorage.getItem("token"))

        const token = tokenObj.token

        const body = document.querySelector("body")

        const sectionModal = document.createElement("section")
        sectionModal.classList = "section-modal flex items-center justify-center"

        const buttonClose = document.createElement("button")
        buttonClose.innerText = "X"
        buttonClose.classList = "button-close-modal"

        const divModal = document.createElement("div")
        divModal.classList = "div-modal-hire flex column items-end"

        body.appendChild(sectionModal)
        sectionModal.appendChild(divModal)

        let divContentModalHire = document.createElement("div")
        divContentModalHire.classList = "flex column width-100 gap-11"

        divModal.append(buttonClose, divContentModalHire)
        
        let department = await getDepartmentsDescription(token, button.id)
        
        let nameDepartment = document.createElement("h1")
        nameDepartment.innerText = department.name

        let divDescriptionInputButton = document.createElement("div")
        divDescriptionInputButton.classList = "flex items-center justify-between"
        let divDescription = document.createElement("div")
        divDescription.classList = "flex column gap-2"
        let divSelectButton = document.createElement("div")
        divSelectButton.classList = "flex column items-end gap-1"

        divDescriptionInputButton.append(divDescription, divSelectButton)

        let descriptionDepartment = document.createElement("h2")
        descriptionDepartment.innerText = department.description
        let companyName = document.createElement("p")
        companyName.innerText = department.companies.name

        divDescription.append(descriptionDepartment, companyName)

        let arrayUsersOutOfWork = await getUsersOutOfWork(token)

        let selectUser = document.createElement("select")
        selectUser.classList = "select-user"
        selectUser.id = button.id
        let optionSelectUser = document.createElement("option")
        optionSelectUser.innerText = "Selecionar usuário"
        selectUser.appendChild(optionSelectUser)
        let buttonHireUser = document.createElement("button")
        buttonHireUser.innerText = "Contratar"
        buttonHireUser.classList = "button-hire-user"

        buttonToHire(buttonHireUser, token)

        renderOptionsSelectUsers(arrayUsersOutOfWork, selectUser)

        divSelectButton.append(selectUser, buttonHireUser)

        let listUsersHired = document.createElement("ul")
        listUsersHired.classList = "list-users-hired flex items-center gap-10"
        listUsersHired.id = button.id 

        let arrayEmployees = await getEmployeesFromDepartment(token, listUsersHired.id)

        divContentModalHire.append(nameDepartment, divDescriptionInputButton, listUsersHired)

        renderListEmployees(arrayEmployees)

        closeModal(buttonClose)
    })
}

async function getDepartmentsDescription(token, id){
    try{
        const request = await fetch("http://localhost:6278/departments", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })

        const response = await request.json()
        
        const department = response.find((obj) => {return obj.uuid == id})
        
        return department

    } catch(err){
        console.log(err)
    }
}

async function getUsersOutOfWork(token){
    try{
        const request = await fetch("http://localhost:6278/admin/out_of_work", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })

        const response = await request.json()
        return response
    } catch(err){
        console.log(err)
    }
}

function renderOptionsSelectUsers (array, tag){
    array.forEach((user)=>{
        let optionUser = document.createElement("option")
        optionUser.innerText = user.username
        optionUser.value = user.uuid

        tag.appendChild(optionUser)
    })
}

function buttonToHire (button, token){
    button.addEventListener("click", async (e)=>{

        let dataUserToHire = {}

        let selectUser = document.querySelector(".select-user")
        if(selectUser.value == "Selecionar usuário"){
            console.log("nao pode")
        } else {
            dataUserToHire.user_uuid = selectUser.value
            dataUserToHire.department_uuid = selectUser.id

            await hire(dataUserToHire, token)

            window.location.reload()
        }
    })
}

async function hire(data, token){
    try{
        const request = await fetch("http://localhost:6278/departments/hire/", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })

        const response = await request.json()
        
    } catch(err){
        console.log(err)
    }
}

async function getEmployeesFromDepartment (token, id){
    try{
        const request = await fetch("http://localhost:6278/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })

        const response = await request.json()
        
        const arrayFilterByDepartment = response.filter((user)=>{return user.department_uuid == id})
        
        return arrayFilterByDepartment
    }catch(err){
        console.log(err)
    }
}

async function renderListEmployees (array){
    const ulList = document.querySelector(".list-users-hired")

    const objTokenLocalStorage = JSON.parse(localStorage.getItem("token"))
    
    const token = objTokenLocalStorage.token

    let arrayDepartments = await getDepartmentsList(token)
    
    array.forEach((user)=>{
        let cardEmployee = document.createElement("li")
        cardEmployee.classList = "flex column items-center gap-5"

        ulList.appendChild(cardEmployee)

        let divContent = document.createElement("div")
        divContent.classList = "flex column width-100 gap-9"
        let buttonTurnOff = document.createElement("button")
        buttonTurnOff.innerText = "Desligar"
        buttonTurnOff.classList = "turn-off-company"
        buttonTurnOff.id = user.uuid

        cardEmployee.append(divContent, buttonTurnOff)

        let name = document.createElement("h4")
        name.innerText = user.username
        let spanLevel = document.createElement("span")
        spanLevel.innerText = user.professional_level[0].toUpperCase() + user.professional_level.substring(1)
        let spanCompany = document.createElement("span")
        let departmenCompany = arrayDepartments.find((department)=>{return department.uuid == user.department_uuid})
        spanCompany.innerText = departmenCompany.companies.name

        divContent.append(name, spanLevel, spanCompany)

        dismissUser(buttonTurnOff)
    })
}

function dismissUser(button){
    button.addEventListener("click", async (e)=>{
        const tokenObj = JSON.parse(localStorage.getItem("token"))

        const token = tokenObj.token

        await dismissUserApi(token, button.id)

        window.location.reload()
    })
}

async function dismissUserApi(token, id){
    try{
        const request = await fetch("http://localhost:6278/departments/dismiss/" + id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })

        const response = request.json()
        return response
    }catch(err){
        console.log(err)
    }
}