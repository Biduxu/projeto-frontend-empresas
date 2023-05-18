function closeModal(button){

    let sectionModal = document.querySelector(".section-modal")

    button.addEventListener("click", (e)=>{
        sectionModal.remove()
    })
}

export function modalEditEmployee(button){
    button.addEventListener("click", (e)=>{
        const body = document.querySelector("body")

        const sectionModal = document.createElement("section")
        sectionModal.classList = "section-modal flex items-center justify-center"

        const buttonClose = document.createElement("button")
        buttonClose.innerText = "X"
        buttonClose.classList = "button-close-modal"

        const divModal = document.createElement("div")
        divModal.classList = "div-modal-edit-employee flex column items-end"

        body.appendChild(sectionModal)
        sectionModal.appendChild(divModal)
        divModal.append(buttonClose)

        closeModal(buttonClose)

        let divContent = document.createElement("div")
        divContent.classList = "flex column width-100 gap-11"

        divModal.append(divContent)

        let title = document.createElement("h1")
        title.innerText = "Editar Usuário"
        let formEditUser = document.createElement("form")
        formEditUser.classList = "form-edit-employee flex column gap-4"
        formEditUser.id = button.id

        divContent.append(title, formEditUser)

        let selectKindOfWork = document.createElement("select")
        selectKindOfWork.id = "kind_of_work"
        selectKindOfWork.name = "tipo"
        let optionSelect = document.createElement("option")
        optionSelect.innerText = "Selecionar modalidade de trabalho"
        selectKindOfWork.append(optionSelect)

        let arrayKindOfWork = ["presencial", "home office", "hibrido"]

        arrayKindOfWork.forEach((kind)=>{
            let optionSelectFromArray = document.createElement("option")
            optionSelectFromArray.innerText = kind
            optionSelectFromArray.value = kind

            selectKindOfWork.append(optionSelectFromArray)
        })

        let selectProfessionalLevel = document.createElement("select")
        selectProfessionalLevel.id = "professional_level"
        selectProfessionalLevel.name = "nível"
        let optionSelectLevel = document.createElement("option")
        optionSelectLevel.innerText = "Selecionar nível profissional"
        selectProfessionalLevel.append(optionSelectLevel)

        let arrayProfessionalLevel = ["estágio", "júnior", "pleno", "sênior"]

        arrayProfessionalLevel.forEach((level)=>{
            let optionSelectFromArrayLevel = document.createElement("option")
            optionSelectFromArrayLevel.innerText = level
            optionSelectFromArrayLevel.value = level

            selectProfessionalLevel.append(optionSelectFromArrayLevel)
        })

        let buttonEditUser = document.createElement("button")
        buttonEditUser.classList = "button-edit-employee"
        buttonEditUser.innerText = "Editar"
        buttonEditUser.type = "submit"

        formEditUser.append(selectKindOfWork, selectProfessionalLevel, buttonEditUser)

        updateUserRegistered()
    })
}

function updateUserRegistered(){
    const form = document.querySelector(".form-edit-employee")

    const elementsForm = [...form.elements]

    let numberAux = 0

    let dataUpdate = {}

    form.addEventListener("submit", async (e)=>{
        e.preventDefault()

        elementsForm.forEach((elem)=>{
            if (elem.tagName == "SELECT" && elem.value == "Selecionar modalidade de trabalho" || elem.value == "Selecionar nível profissional"){
                let spanAlert = document.createElement("span")
                    spanAlert.innerText = `Selecione o ${elem.name}` 
                    spanAlert.classList = "span-alert"
                    
                    form.append(spanAlert)
            } else {
                if (elem.tagName !== "BUTTON"){
                    dataUpdate[elem.id] = elem.value
                    numberAux++
                }
            }
        })
    
        if(numberAux == 2){
            await updateUserApi(dataUpdate, form.id)

            window.location.reload()            
        }
    })
}

async function updateUserApi(data, id){
    const tokenObj = JSON.parse(localStorage.getItem("token"))

    const token = tokenObj.token
    
    try{
        const request = await fetch("http://localhost:6278/admin/update_user/" + id, {
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
        console.log(err)
    }
}

export function modalDeleteUser(button, name){
    button.addEventListener("click", (e)=>{
        const body = document.querySelector("body")

        const sectionModal = document.createElement("section")
        sectionModal.classList = "section-modal flex items-center justify-center"

        const buttonClose = document.createElement("button")
        buttonClose.innerText = "X"
        buttonClose.classList = "button-close-modal"

        const divModal = document.createElement("div")
        divModal.classList = "div-modal-delete-user flex column items-end"

        body.appendChild(sectionModal)
        sectionModal.appendChild(divModal)
        divModal.append(buttonClose)

        closeModal(buttonClose)

        let divContent = document.createElement("div")
        divContent.classList = "flex column width-100 items-center gap-13"

        let alertTitle = document.createElement("h2")
        alertTitle.innerText = `Realmente deseja remover o usuário ${name}?`

        let buttonDeleteUser = document.createElement("button")
        buttonDeleteUser.innerText = "Deletar"
        buttonDeleteUser.classList = "button-delete-user"
        buttonDeleteUser.id = button.id

        divModal.append(divContent)

        divContent.append(alertTitle, buttonDeleteUser)

        deleteUser()
    })
}

function deleteUser(){
    const tokenObj = JSON.parse(localStorage.getItem("token"))

    const token = tokenObj.token

    const buttonDeleteUser = document.querySelector(".button-delete-user")

    buttonDeleteUser.addEventListener("click", async (e)=>{
        try{
            const request = await fetch("http://localhost:6278/admin/delete_user/" + buttonDeleteUser.id , {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            const response = await request.json()

            window.location.reload()
            
        } catch(err){
            console.log(err)
        }
    })
}