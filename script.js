// получение данных из файлов базы данных (.JSON)

let cities = [];
let specializations = [];
let persons = [];

Promise.all(
    [
        fetch('cities.json'),
        fetch('specializations.json'),
        fetch('person.json'),
    ]
).then(async ([citiesResponse, specializationsResponse, personsResponse]) => {
    const citiesJson = await citiesResponse.json();
    const specializationsJson = await specializationsResponse.json();
    const personsJson = await personsResponse.json();
    return [citiesJson, specializationsJson, personsJson];
})
    .then(response => {
        cities = response[0]; // здесь уже присвоили данные данные из файлов
        specializations = response[1]; // здесь уже присвоили данные данные из файлов
        persons = response[2]; // здесь уже присвоили данные данные из файлов

        arrayData();
    })

function arrayData() {
    let names = persons.map(item => item.personal.firstName);
    console.log(names);
    let lastNames = persons.map(item => item.personal.lastName);
    console.log(lastNames);
    let personsWithCities = persons.map(item => { // заменим locationId на название города
        let city = cities.find(function (cityItem) {
            return cityItem.id === item.personal.locationId;  // Находим город по locationId
        });
        if (city && city.name) {
            item.city = city.name;
        }
        return item.city;
    });
    console.log(personsWithCities);

    let obj = {
        firstName: names[0],
        lastName: lastNames[0],
        city: personsWithCities[0],
    }

    function getInfo() {
        return (`${this.firstName} ${this.lastName}, ${this.city}`);
    }

    let result = function () {
        return getInfo.call(obj);
    }
    console.log(result());

    // Функция для поиска дизайнеров, владеющих Figma
    function findFigmaDesigners() {
        let designers = persons.filter(item => item.personal.specializationId === 3); //находим дизайнеров по id=3

        let designersWithFigma = designers.filter(designer => // находим дизайнеров, владеющих Figma
            designer.skills.some(skill => skill.name === 'Figma'));

        designersWithFigma.forEach(designer => {
            const obj2 = {
                firstName: designer.personal.firstName,
                lastName: designer.personal.lastName,
                city: designer.city,
            }
            console.log(getInfo.call(obj2));
        })
    }

    findFigmaDesigners();

    // Функция для поиска первого разработчика, владеющего React
    function findReactDevelopers() {
        let developers = persons.filter(item => item.personal.specializationId === 1 || item.personal.specializationId === 2);

        let developersWithReact = developers.find(item => item.skills.some(skill => skill.name === 'React'));

        const obj3 = {
            firstName: developersWithReact.personal.firstName,
            lastName: developersWithReact.personal.lastName,
            city: developersWithReact.city,
        }
        console.log(getInfo.call(obj3));
    }

    findReactDevelopers();


    // проверка, все ли пользователи старше 18 лет
    function findDateOfBirth() {

        let allOlderThan18 = persons.every(item => {
            let birthDay = item.personal.birthday;
            let dateParts = birthDay.split('.');
            let newDate = new Date(+dateParts[2], +dateParts[1], +dateParts[0]);
            let year = newDate.getFullYear();
            return year <= 2007;
        });

        if (allOlderThan18) {
            console.log('Все пользователи старше 18 лет.');
        } else {
            console.log('Не все пользователи старше 18 лет.');
        }
    }

    findDateOfBirth();


    function sortInAscendingOrder() {
        let backendDevelopers = persons.filter(item => item.personal.specializationId === 2);
        let backendDevelopersCity = backendDevelopers.filter(item => item.personal.locationId === 1);

        let fullDayBackendDeveloper = backendDevelopersCity.filter(item => item.request.some(request => request.value === 'Полная'));
        console.log(fullDayBackendDeveloper)

        let price = fullDayBackendDeveloper.filter(item => item.request.some(request => request.name === 'Зарплата'))

        let sorted = price.sort((a, b) => {
            let aSalary = a.request.find(item => item.name === 'Зарплата').value;
            let bSalary = b.request.find(item => item.name === 'Зарплата').value;
            return parseInt(aSalary, 10) - parseInt(bSalary, 10);
        });
        console.log(sorted)
    }

    sortInAscendingOrder();


    // Функция для поиска дизайнеров, владеющих  Figma с уровнем level > 5
    function findDesigners() {

        let minLevel = 5;

        let designers = persons.filter(item => item.personal.specializationId === 3); //находим дизайнеров по id=3

        let designersWithFigma = designers.filter(designer => // находим дизайнеров, владеющих Figma
            designer.skills.some(skill => skill.name === 'Figma' && parseInt(skill.level, 10) > minLevel));
        console.log(designersWithFigma);

        let designersWithPhotoshop = designersWithFigma.filter(designer => // находим дизайнеров, владеющих Figma и Photoshop
            designer.skills.some(skill => skill.name === 'Photoshop' && parseInt(skill.level, 10) > minLevel));
        console.log(designersWithPhotoshop);
    }

    findDesigners();


    //Соберите команду для разработки проекта
    function findBestSpecialist(specializationId, skillName) {

        let specialist = persons.filter(item => item.personal.specializationId === specializationId);

        let bestSpecialist = specialist.reduce((best, current) => {
            let bestSkill = best ? best.skills.find(item => item.name === skillName) : null; //лучший текущий специалист
            let currentSkill = current.skills.find(item => item.name === skillName); //текущий специалист
            return (bestSkill && currentSkill && currentSkill.level > bestSkill.level ? current : best);
        });
        return bestSpecialist;
    }

    let designer = findBestSpecialist(3, 'Figma')
    let frontendDeveloper = findBestSpecialist(1, 'Angular') //здесь ошибка - выводит самого первого по ID 1, по Angular не ищет
    let backendDeveloper = findBestSpecialist(2, 'Go')

    console.log(designer)
    console.log(frontendDeveloper)
    console.log(backendDeveloper)


    const designerObj = {
        firstName: designer.personal.firstName,
        lastName: designer.personal.lastName,
        city: designer.city,

    }
    const frontendDeveloperObj = {
        firstName: frontendDeveloper.personal.firstName,
        lastName: frontendDeveloper.personal.lastName,
        city: frontendDeveloper.city,

    }
    const backendDeveloperObj = {
        firstName: backendDeveloper.personal.firstName,
        lastName: backendDeveloper.personal.lastName,
        city: backendDeveloper.city,

    }
    console.log(getInfo.call(designerObj));
    console.log(getInfo.call(frontendDeveloperObj));
    console.log(getInfo.call(backendDeveloperObj));
}



