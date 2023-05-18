import { toastUserCreateSucess } from "../../scripts/toast.js";
import {loginUser} from "../../scripts/api.js"

function getToastCreateUserSucessFromLocalStorage (){
    let toastResult = localStorage.getItem("toast")

    if(toastResult == "yes"){
        toastUserCreateSucess()
        localStorage.removeItem("toast")
    }
}

getToastCreateUserSucessFromLocalStorage()

function eventLogin (){
    const form = document.querySelector("form")

    const elementsForm = [...form.elements] 

    form.addEventListener("submit", async (e)=>{
        e.preventDefault()

        const body = {}
        let numberAux = 0

        elementsForm.forEach((elementHTML)=>{
            if(elementHTML.tagName == "INPUT" && elementHTML.value == ""){
                elementHTML.classList = "input-alert"

                let spanAlert = document.createElement("span")
                spanAlert.innerText = `Preencha o campo ${elementHTML.name}` 
                spanAlert.classList = "span-alert"
                
                form.append(spanAlert)
            } else {
                if(elementHTML.tagName !== "BUTTON"){
                    body[elementHTML.id] = elementHTML.value
                    numberAux++
                }
            }
        })

        if (numberAux == 2){
            await loginUser(body)
        }
    })
}

eventLogin()