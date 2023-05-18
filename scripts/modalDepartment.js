function closeModal(button){

    let sectionModal = document.querySelector(".section-modal")

    button.addEventListener("click", (e)=>{
        sectionModal.remove()
    })
}

export function modalCreateDepartment(button){
    button.addEventListener("click", (e)=>{
        const body = document.querySelector("body")

        const sectionModal = document.createElement("section")
        sectionModal.classList = "section-modal flex items-center justify-center"

        const buttonClose = document.createElement("button")
        buttonClose.innerText = "X"
        buttonClose.classList = "button-close-modal"

        const divModal = document.createElement("div")
        divModal.classList = "div-modal-create flex column items-end"

        body.appendChild(sectionModal)
        sectionModal.appendChild(divModal)
        divModal.append(buttonClose)

        closeModal(buttonClose)

        let divTitleForm = document.createElement("div")
        divTitleForm.classList = "flex column width-100 gap-11"

        divModal.append(divTitleForm)

        let title = document.createElement("h1")
        title.innerText = "Criar Departamento"

        let form = document.createElement("form")
        form.classList = "form-create flex column gap-4"

        divTitleForm.append(title, form)

        let inputName = document.createElement("input")
        inputName.placeholder = "Nome do departamento"
        inputName.id = "name"
        inputName.name = "nome do departamento"
        let inputDescription = document.createElement("input")
        inputDescription.placeholder = "Descrição"
        inputDescription.id = "description"
        inputDescription.name = "da descrição"
        let selectCompany = document.createElement("select")
        selectCompany.classList = "select-company-create-department"
        selectCompany.name = "da seleção da empresa"
        selectCompany.id = "company_uuid"
        let optionSelect = document.createElement("option")
        optionSelect.innerText = "Selecionar empresa"
        selectCompany.appendChild(optionSelect)
        let buttonCreateDepartment = document.createElement("button")
        buttonCreateDepartment.classList = "button-create-department"
        buttonCreateDepartment.innerText = "Criar o departamento"
        buttonCreateDepartment.type = "submit"

        form.append(inputName, inputDescription, selectCompany, buttonCreateDepartment)
        renderSelectCompanies()
        getDataNewDepartment()
    })
}

async function renderSelectCompanies(){

    const selectCompany = document.querySelector(".select-company-create-department")

    try{
        const request = await fetch("http://localhost:6278/companies", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })

        const response = await request.json()
        
        response.forEach((company)=>{
            let optionCompany = document.createElement("option")
            optionCompany.innerText = company.name
            optionCompany.value = company.uuid
            selectCompany.append(optionCompany)
        })

    } catch(err) {
        console.log(err)
    }
}

function getDataNewDepartment(){
    const tokenObj = JSON.parse(localStorage.getItem("token"))

    const token = tokenObj.token

    const form = document.querySelector(".form-create")

    const elementsForm = [...form.elements] 

    form.addEventListener("submit", async (e)=>{
        e.preventDefault()

        const body = {}

        let numberAux = 0

        elementsForm.forEach((elementHTML)=>{
            if(elementHTML.tagName == "INPUT" && elementHTML.value == "" || elementHTML.tagName == "SELECT" && elementHTML.value == "Selecionar empresa"){

                let spanAlert = document.createElement("span")
                spanAlert.innerText = `Preencha o campo ${elementHTML.name}` 
                spanAlert.classList = "span-alert"
                
                form.append(spanAlert)
            }else {
                if(elementHTML.tagName !== "BUTTON"){
                    body[elementHTML.id] = elementHTML.value
                    numberAux++
                }
            }
        })

        if (numberAux == 3){
            await createDepartment(token, body)

            window.location.reload()
        }
    })
}

async function createDepartment(token, data){
    try{
        const request = await fetch("http://localhost:6278/departments", {
            method: "POST",
            headers:{
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


export function modalEditDepartment (button, description){
    button.addEventListener("click", (e)=>{
        const body = document.querySelector("body")

        const sectionModal = document.createElement("section")
        sectionModal.classList = "section-modal flex items-center justify-center"

        const buttonClose = document.createElement("button")
        buttonClose.innerText = "X"
        buttonClose.classList = "button-close-modal"

        const divModal = document.createElement("div")
        divModal.classList = "div-modal-edit-department flex column items-end"

        body.appendChild(sectionModal)
        sectionModal.appendChild(divModal)
        divModal.append(buttonClose)

        closeModal(buttonClose)

        let divContent = document.createElement("div")
        divContent.classList = "flex column width-100 gap-11"

        divModal.append(divContent)

        let title = document.createElement("h1")
        title.innerText = "Editar Departamento"
        let divTextereaButton = document.createElement("div")
        divTextereaButton.classList = "flex column gap-1"

        divContent.append(title, divTextereaButton)

        let textereaDescription = document.createElement("textarea")
        textereaDescription.value = description
        let buttonSaveEdit = document.createElement("button")
        buttonSaveEdit.innerText = "Salvar alterações"
        buttonSaveEdit.classList = "button-save-edit"

        divTextereaButton.append(textereaDescription, buttonSaveEdit)

        getNewDescriptionDepartment(button.id)
    })
}

function getNewDescriptionDepartment (id){
    const buttonEditDepartment = document.querySelector(".button-save-edit")
    const textereaDescription = document.querySelector("textarea")

    const tokenObj = JSON.parse(localStorage.getItem("token"))

    const token = tokenObj.token

    buttonEditDepartment.addEventListener("click", async (e)=>{
        let newDescription = {}
        newDescription.description = textereaDescription.value
        await updateDescriptionDepartment(token, id, newDescription)
        window.location.reload()
    })
}

async function updateDescriptionDepartment(token, id, data){
    try{
        const request = await fetch("http://localhost:6278/departments/" + id, {
            method: "PATCH",
            headers:{
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

export function modalDeleteDepartment(button, name){
    button.addEventListener("click", (e)=>{
        const body = document.querySelector("body")

        const sectionModal = document.createElement("section")
        sectionModal.classList = "section-modal flex items-center justify-center"

        const buttonClose = document.createElement("button")
        buttonClose.innerText = "X"
        buttonClose.classList = "button-close-modal"

        const divModal = document.createElement("div")
        divModal.classList = "div-modal-delete-department flex column items-end"

        body.appendChild(sectionModal)
        sectionModal.appendChild(divModal)
        divModal.append(buttonClose)

        closeModal(buttonClose)

        let divContent = document.createElement("div")
        divContent.classList = "flex column items-center width-100 gap-12"

        divModal.append(divContent)

        let alertInformation = document.createElement("h2")
        alertInformation.innerText = `Realmente deseja deletar o Departamento ${name} e demitir seus funcionários?`
        let buttonDeleteDepartment = document.createElement("button")
        buttonDeleteDepartment.innerText = "Confirmar"
        buttonDeleteDepartment.classList = "button-delete-department"
        buttonDeleteDepartment.id = button.id

        divContent.append(alertInformation, buttonDeleteDepartment)
        deleteDepartmentEvent()
    })
}

function deleteDepartmentEvent(){
    const tokenObj = JSON.parse(localStorage.getItem("token"))

    const token = tokenObj.token

    const buttonDelete = document.querySelector(".button-delete-department")

    buttonDelete.addEventListener("click", async (e)=>{
        await deleteDepartment(token, buttonDelete.id)
        window.location.reload()
    })
}

async function deleteDepartment(token, id){
    try{
        const request = await fetch("http://localhost:6278/departments/" + id, {
            method: "DELETE",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })

        return request
    } catch(err){
        console.log(err)
    }
}