export const toastUserCreateSucess = ()=>{
    const body = document.querySelector("body")

    const container = document.createElement("div")
    container.classList = "toast-container"

    const paragraphToast = document.createElement("p")
    paragraphToast.innerText = "Usuário criado com sucesso!"

    container.appendChild(paragraphToast)

    body.appendChild(container)
}