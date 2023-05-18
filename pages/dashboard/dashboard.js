import {getUserProfile, validateUser, getDepartmentsList, getUsersRegistered, listDepartmentsOfEmployeesCompany, coworkers, getDepartmentsFilteredByCompany, getCompaniesList} from "./../../scripts/api.js";
import {modalEdit, modalHireUser} from "./../../scripts/modal.js";
import {modalCreateDepartment, modalEditDepartment, modalDeleteDepartment} from "./../../scripts/modalDepartment.js";
import {modalEditEmployee, modalDeleteUser} from "./../../scripts/modalUserEditDelete.js";

function logout(){
    const buttonLogout = document.querySelector(".logout")
    buttonLogout.addEventListener("click", (e)=>{
        localStorage.removeItem("token")
        window.location.replace("./../../index.html")
    })
}

logout()

async function renderProfileUser (){
    const objTokenLocalStorage = JSON.parse(localStorage.getItem("token"))
    
    const token = objTokenLocalStorage.token
    
    const admin = await validateUser(token)

    if(admin.is_admin == true){
        renderDepartmentSectionAdmin(token)
        renderUsersRegisteredAdmin(token)
    } else {
        const dataUser = await getUserProfile(token)
        
        const mainDashboard = document.querySelector("main")
    
        let sectionProfileData = document.createElement("section")
        sectionProfileData.classList = "section-profile flex items-center justify-between"

        mainDashboard.appendChild(sectionProfileData)

        const divData = document.createElement("div")
        divData.classList = "flex items-end gap-6"

        const imageEdit = document.createElement("img")
        imageEdit.src = "./../../src/images/Vector.png"

        sectionProfileData.append(divData, imageEdit)

        const divNameEmail = document.createElement("div")
        divNameEmail.classList = "flex column gap-2"
        const name = document.createElement("h2")
        name.innerText = dataUser.username
        const emailUser = document.createElement("p")
        emailUser.innerText = `Email: ${dataUser.email}`
        divNameEmail.append(name, emailUser)

        const professionalLevel = document.createElement("p")
        professionalLevel.innerText = dataUser.professional_level[0].toUpperCase() + dataUser.professional_level.substring(1)
        
        const kindOfWork = document.createElement("p")
        if(dataUser.kind_of_work !== null){
            kindOfWork.innerText = dataUser.kind_of_work[0].toUpperCase() + dataUser.kind_of_work.substring(1)
        }
        
        divData.append(divNameEmail, professionalLevel, kindOfWork)

        modalEdit(imageEdit)
        renderUserDepartment()
    }
}

renderProfileUser()

async function renderUserDepartment(){
    const objTokenLocalStorage = JSON.parse(localStorage.getItem("token"))
    
    const token = objTokenLocalStorage.token
    
    const dataUser = await getUserProfile(token)

    const mainDashboard = document.querySelector("main")
    
    const departmentId = dataUser.department_uuid
    if (departmentId == null){
        const sectionDepartmentUser = document.createElement("section")
        sectionDepartmentUser.classList = "section-department-user-without-job flex items-center justify-center"

        mainDashboard.appendChild(sectionDepartmentUser)

        const textWithoutJob = document.createElement("h2")
        textWithoutJob.innerText = "Você ainda não foi contratado"

        sectionDepartmentUser.appendChild(textWithoutJob)

    } else {
        const dataUser = await getUserProfile(token)

        let listDepartmentsUser = await listDepartmentsOfEmployeesCompany(token)
        
        let listCoworkers = await coworkers(token)
        
        const sectionDepartmentUser = document.createElement("section")

        mainDashboard.appendChild(sectionDepartmentUser)

        const divName = document.createElement("div")
        divName.classList = "div-name flex width-100 justify-center"

        let titleName = document.createElement("h2")
        titleName.innerText = `${listDepartmentsUser.name} - ${listCoworkers[0].name}`

        divName.appendChild(titleName)

        let coworkersList = document.createElement("ul")
        coworkersList.classList = "list-coworkers flex width-100 justify-center gap-15 wrap"

        sectionDepartmentUser.append(divName, coworkersList)

        let arrayCoworkers = listCoworkers[0].users

        let arrayCoworkersWithoutUser = arrayCoworkers.filter((user)=>{return user.username !== dataUser.username})

        renderListCoworkers(arrayCoworkersWithoutUser)
    }
    
}

async function renderDepartmentSectionAdmin (token){
    const main = document.querySelector("main")

    const sectionDepartment = document.createElement("section")
    sectionDepartment.classList = "flex column gap-11"

    main.appendChild(sectionDepartment)

    const divNavDepartment = document.createElement("div")
    divNavDepartment.classList = "nav-department flex items-center justify-between"

    let titleDepartment = document.createElement("h2")
    titleDepartment.innerText = "Departamentos"

    let selectCompany = document.createElement("select")
    selectCompany.classList = "select-company"
    let optionSelect = document.createElement("option")
    optionSelect.innerText = "Selecionar Empresa"
    selectCompany.appendChild(optionSelect)

    let buttonCreate = document.createElement("button")
    buttonCreate.classList = "button-create"
    let spanPlus = document.createElement("p")
    spanPlus.innerText = "+"
    spanPlus.classList = "span-plus"
    let spanCreate = document.createElement("span")
    spanCreate.innerText = "Criar"
    buttonCreate.append(spanPlus, spanCreate)

    divNavDepartment.append(titleDepartment, selectCompany, buttonCreate)

    const listDepartments = document.createElement("ul")
    listDepartments.classList = "list-departments flex gap-8 wrap"

    sectionDepartment.append(divNavDepartment, listDepartments)

    let arrayDepartments = await getDepartmentsList(token)
    
    renderListDepartments(arrayDepartments)
    modalCreateDepartment(buttonCreate)
    await renderDepartmentsFromSelectedCompany()
}

function renderListDepartments (array){

    const listDepartments = document.querySelector(".list-departments")

    array.forEach((department)=>{
        let cardDepartment = document.createElement("li")
        cardDepartment.classList = "card-department flex column gap-10"
        
        listDepartments.appendChild(cardDepartment)

        let divInformation = document.createElement("div")
        divInformation.classList = "div-information-department flex column gap-9"

        let departmentName = document.createElement("h3")
        departmentName.innerText = department.name
        let departmentDescription = document.createElement("p")
        departmentDescription.innerText = department.description
        let companyName = document.createElement("p")
        companyName.innerText = department.companies.name

        divInformation.append(departmentName, departmentDescription, companyName)

        let divButtons = document.createElement("div")
        divButtons.classList = "flex gap-5 width-100 justify-center"

        let imageEye = document.createElement("img")
        imageEye.src = "./../../src/images/VectorEye.png"
        imageEye.id = department.uuid
        let imageEditBlack = document.createElement("img")
        imageEditBlack.src = "./../../src/images/VectorEditBlack.png"
        imageEditBlack.id = department.uuid
        let imageTrash = document.createElement("img")
        imageTrash.src = "./../../src/images/Trash.png"
        imageTrash.id = department.uuid

        divButtons.append(imageEye, imageEditBlack, imageTrash)

        cardDepartment.append(divInformation, divButtons)
        modalHireUser(imageEye)
        modalEditDepartment(imageEditBlack, department.description)
        modalDeleteDepartment(imageTrash, department.name)
    })
}

async function renderUsersRegisteredAdmin(token){
    const main = document.querySelector("main")

    const sectionUsersRegistered = document.createElement("section")
    sectionUsersRegistered.classList = "section-users-registered flex column gap-11 items-center"

    main.appendChild(sectionUsersRegistered)

    let titleUsers = document.createElement("h2")
    titleUsers.innerText = "Usuários cadastrados"

    let listUsersRegistered = document.createElement("ul")
    listUsersRegistered.classList = "list-users-registered flex gap-8 wrap"

    sectionUsersRegistered.append(titleUsers, listUsersRegistered)

    let arrayUsers = await getUsersRegistered(token)
    
    renderListUsers(arrayUsers)
}

async function renderListUsers (array){
    const objTokenLocalStorage = JSON.parse(localStorage.getItem("token"))
    
    const token = objTokenLocalStorage.token

    let arrayDepartments = await getDepartmentsList(token)
    
    let listUsersRegistered = document.querySelector(".list-users-registered")
    
    array.forEach((user)=>{
        if(user.is_admin == false){
            let cardUser = document.createElement("li")
            cardUser.classList = "card-user flex column gap-10"
            
            listUsersRegistered.appendChild(cardUser)

            let divInformation = document.createElement("div")
            divInformation.classList = "div-information-user flex column gap-9"

            let userName = document.createElement("h3")
            userName.innerText = user.username
            let professionalLevel = document.createElement("p")
            professionalLevel.innerText = user.professional_level[0].toUpperCase() + user.professional_level.substring(1)
            let companyName = document.createElement("p")
            if(user.department_uuid == null){
                companyName.innerText = "Sem contrato"
            } else {
                let departmenCompany = arrayDepartments.find((department)=>{return department.uuid == user.department_uuid})
                companyName.innerText = departmenCompany.companies.name
            }
            
            divInformation.append(userName, professionalLevel, companyName)

            let divButtons = document.createElement("div")
            divButtons.classList = "flex gap-5 width-100 justify-center"

            let imageEdit = document.createElement("img")
            imageEdit.src = "./../../src/images/Vector.png"
            imageEdit.id = user.uuid
            let imageTrash = document.createElement("img")
            imageTrash.src = "./../../src/images/Trash.png"
            imageTrash.id = user.uuid

            divButtons.append(imageEdit, imageTrash )

            cardUser.append(divInformation, divButtons)
        
            modalEditEmployee(imageEdit)
            modalDeleteUser(imageTrash, user.username)
        }
        
    })
}

function renderListCoworkers(array){
    const ulCoworkers = document.querySelector(".list-coworkers")

    array.forEach((userCoworker)=>{
        let cardCoworker = document.createElement("li")
        cardCoworker.classList = "card-coworker flex column gap-14"

        ulCoworkers.appendChild(cardCoworker)

        let nameCoworker = document.createElement("h4")
        nameCoworker.innerText = userCoworker.username

        let levelCoworker = document.createElement("p")
        levelCoworker.innerText = userCoworker.professional_level[0].toUpperCase() + userCoworker.professional_level.substring(1)

        cardCoworker.append(nameCoworker, levelCoworker)
    })

}

async function renderDepartmentsFromSelectedCompany(){
    const selectCompany = document.querySelector(".select-company")
    const listDepartments = document.querySelector(".list-departments")

    const objTokenLocalStorage = JSON.parse(localStorage.getItem("token"))
    
    const token = objTokenLocalStorage.token

    let companiesList = await getCompaniesList()

    let arrayDepartments = await getDepartmentsList(token)
    
    companiesList.forEach((company)=>{
        let optionCompany = document.createElement("option")
        optionCompany.innerText = company.name
        optionCompany.value = company.uuid

        selectCompany.appendChild(optionCompany)
    })
    selectCompany.addEventListener("input", async(e)=>{
        if(selectCompany.value == "Selecionar Empresa"){
            listDepartments.innerHTML = ""
            renderListDepartments(arrayDepartments)
        }else{
            const listDepartmentsCompany = await getDepartmentsFilteredByCompany(token, selectCompany.value)
            listDepartments.innerHTML = ""
            renderListDepartments(listDepartmentsCompany)
        }
        
    })
}