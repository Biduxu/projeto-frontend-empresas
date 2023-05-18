import { getCompaniesList, getSectorsList, getCompaniesBySector } from "../../scripts/api.js";

async function renderListCompanies (){
    const arrayCompanies = await getCompaniesList()

    const listCompanies = document.querySelector(".list-companies")

    arrayCompanies.forEach((company) =>{
        let cardCompany = document.createElement("li")
        cardCompany.classList = "card-company flex column gap-4"

        let companyName = document.createElement("h4")
        companyName.classList = "company-name"
        companyName.innerText = company.name

        let spanOpening = document.createElement("span")
        spanOpening.classList = "company-opening"
        spanOpening.innerText = company.opening_hours +" horas"

        let sectorCompany = document.createElement("button")
        sectorCompany.classList = "button-sector"
        sectorCompany.innerText = company.sectors.description

        cardCompany.append(companyName, spanOpening, sectorCompany)

        listCompanies.appendChild(cardCompany)
    })
    
}

renderListCompanies()

async function renderOptionsSelectBySectors(){
    const arraySectorsList = await getSectorsList()

    const selectSector = document.querySelector("select")

    arraySectorsList.forEach((sector)=>{
        const optionSector = document.createElement("option")
        optionSector.innerText = sector.description
        optionSector.value = sector.description

        selectSector.append(optionSector)
    })
}

renderOptionsSelectBySectors()

function filterCompaniesBySector(){
    const selectSector = document.querySelector("select")

    const listCompanies = document.querySelector(".list-companies")

    selectSector.addEventListener("input", async(e)=>{
        if (selectSector.value !== ""){
            let companySector = selectSector.value
            let arrayCompaniesFilteredBySector = await getCompaniesBySector(companySector)
            
            listCompanies.innerHTML = ""

            arrayCompaniesFilteredBySector.forEach((company)=>{
                let cardCompany = document.createElement("li")
                cardCompany.classList = "card-company flex column gap-4"

                let companyName = document.createElement("h4")
                companyName.classList = "company-name"
                companyName.innerText = company.name

                let spanOpening = document.createElement("span")
                spanOpening.classList = "company-opening"
                spanOpening.innerText = company.opening_hours +" horas"

                let sectorCompany = document.createElement("button")
                sectorCompany.classList = "button-sector"
                sectorCompany.innerText = company.sectors.description

                cardCompany.append(companyName, spanOpening, sectorCompany)

                listCompanies.appendChild(cardCompany)
            })
        } else {
            listCompanies.innerHTML = ""
            await renderListCompanies()
        }
    })
}

filterCompaniesBySector()