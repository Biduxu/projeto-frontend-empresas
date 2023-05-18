import { registerUser } from "../../scripts/api.js";

function eventRegister(){
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
        if(numberAux == 4){
           await registerUser(body)
        }
    })
}

eventRegister()
