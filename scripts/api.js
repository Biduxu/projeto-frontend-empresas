const baseUrl = "http://localhost:6278/"

export async function getCompaniesList (){
    try{
        const request = await fetch(baseUrl + "companies", {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        })

        const response = await request.json()

        return response
    } catch(err){
        console.log(err)
    }
} 

export async function getSectorsList (){
    try{
        const request = await fetch(baseUrl + "sectors", {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        })

        const response = await request.json()

        return response

    } catch(err){
        console.log(err)
    }
}

export async function getCompaniesBySector(companySector){
    try{
        const request = await fetch(baseUrl + "companies/" + companySector, {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        })

        const response = await request.json()
        return response

    } catch(err){
        console.log(err)
    }
}

export async function registerUser(body){
    try{
        const request = await fetch(baseUrl + "auth/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        })

        const response = await request.json()

        if(response.error == "insert a valid email!" || response.error == "email alread exists!"){
            const form = document.querySelector("form")
            let spanAlert = document.createElement("span")
            spanAlert.classList = "span-alert"
            spanAlert.innerText = "E-mail inválido ou já existe!"

            form.appendChild(spanAlert)
        } else{
            localStorage.setItem("toast", "yes")
            
            window.location.replace("./../login/login.html")
        }

    } catch(err){
        console.log(err)
    }
}

export async function loginUser(body){
    try{
        const request = await fetch(baseUrl + "auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        })

        const response = await request.json()
        
        if(response.error == "email invalid!" || response.error == "password invalid!"){
            const form = document.querySelector("form")
            let spanAlert = document.createElement("span")
            spanAlert.classList = "span-alert"

            if(response.error == "email invalid!"){
                spanAlert.innerText = "E-mail inválido!"
                form.appendChild(spanAlert)
            } else {
                spanAlert.innerText = "Senha inválida!"
                form.appendChild(spanAlert)
            }
            
        } else {
            const tokenUser = JSON.stringify(response) 
            localStorage.setItem("token", tokenUser)

            window.location.replace("./../dashboard/dashboard.html")
        }
    
    } catch(err){
        console.log(err)
    }
}

export async function getUserProfile(token){
    try{
        const request = await fetch(baseUrl + "users/profile", {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })

        const response  = await request.json()
        
        return response
    } catch(err){
        console.log(err)
    }
}

export async function validateUser(token){
    try{
        const request = await fetch(baseUrl + "auth/validate_user", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })

        const response = await request.json()
        
        return response
    } catch (err){
        console.log(err)
    }
}

export async function getDepartmentsList(token){
    try{
        const request = await fetch(baseUrl + "departments", {
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

export async function getUsersRegistered(token){
    try{
        const request = await fetch(baseUrl + "users", {
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

export async function listDepartmentsOfEmployeesCompany(token){
    try{
        const request = await fetch(baseUrl + "users/departments" ,{
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

export async function coworkers(token){
    try{
        const request = await fetch(baseUrl + "users/departments/coworkers", {
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

export async function getDepartmentsFilteredByCompany(token, id){
    try{
        const request = await fetch("http://localhost:6278/departments/" + id,{
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