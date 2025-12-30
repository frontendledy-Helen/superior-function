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

    function getInfo() {
        let locationId = this.personal.locationId;
        let city = cities.find(cityId => cityId.id === locationId);
        return (`${this.personal.firstName} ${this.personal.lastName}, ${city.name}`);
    }

    console.log(getInfo.call(persons[0])); // вывод самого первого объекта из массива persons

    // Функция для поиска дизайнеров, владеющих Figma
    function findFigmaDesigners() {
        let designers = persons.filter(item => item.personal.specializationId === 3); //находим дизайнеров по id=3

        let designersWithFigma = designers.filter(designer => // находим дизайнеров, владеющих Figma
            designer.skills.some(skill => skill.name === 'Figma'));

        designersWithFigma.forEach(designer => {
            console.log('figma designers', getInfo.call(designer));
        })
    }

    findFigmaDesigners();

    // Функция для поиска первого разработчика, владеющего React
    function findReactDevelopers() {
        let developers = persons.filter(item => item.personal.specializationId === 1 || item.personal.specializationId === 2);

        let developersWithReact = developers.find(item => item.skills.some(skill => skill.name === 'React'));

        console.log('react developer', getInfo.call(developersWithReact));
    }

    findReactDevelopers();


    // проверка, все ли пользователи старше 18 лет
    function findDateOfBirth() {

        let allOlderThan18 = persons.every(item => {
            let birthDay = item.personal.birthday;
            let dateParts = birthDay.split('.');
            let newDate = new Date(+dateParts[2], +dateParts[1], +dateParts[0]);
            let year = newDate.getFullYear(); //год рождения
            let currentYear = new Date().getFullYear(); //получили текущий год
            return currentYear - year > 18; //получили true или false
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

        let price = fullDayBackendDeveloper.filter(item => item.request.some(request => request.name === 'Зарплата'));

        let sorted = price.sort((a, b) => {
            let aSalary = a.request.find(item => item.name === 'Зарплата').value;
            let bSalary = b.request.find(item => item.name === 'Зарплата').value;
            return aSalary - bSalary;
        });
        console.log('отсортировано по зарплате', sorted);
    }

    sortInAscendingOrder();


    // Функция для поиска дизайнеров, владеющих  Figma с уровнем level > 5
    function findDesigners() {

        let minLevel = 5;

        let designers = persons.filter(item => item.personal.specializationId === 3); //находим дизайнеров по id=3

        let designersWithFigma = designers.filter(designer => // находим дизайнеров, владеющих Figma
            designer.skills.some(skill => skill.name === 'Figma' && skill.level > minLevel));
        console.log('уровень по Figma (6 и более)', designersWithFigma);

        let designersWithPhotoshop = designersWithFigma.filter(designer => // находим дизайнеров, владеющих Figma и Photoshop
            designer.skills.some(skill => skill.name === 'Photoshop' && skill.level > minLevel));
        console.log('уровень по Figma и Photoshop (6 и более)', designersWithPhotoshop);
    }

    findDesigners();


    //Соберите команду для разработки проекта
    function findBestSpecialist(specializationId, skillName) {

        let specialist = persons.filter(item => item.personal.specializationId === specializationId);

        let developersSkillName = specialist.filter(item => item.skills.some(skill => skill.name === skillName));
        // console.log('распределение по skillName', developersSkillName);

        let developersSorted = developersSkillName.sort((a, b) => {
            let aSkill = a.skills.find(item => item.name === skillName).level;
            let bSkill = b.skills.find(item => item.name === skillName).level;
            return bSkill - aSkill; // сортировка от высшего уровня
        });
        // console.log('отсортировано по уровню', developersSorted);

        return developersSorted.find(item => item.skills.some(skill => skill.name === skillName)); // берём самого первого из отсортированных
    }

    let designer = findBestSpecialist(3, 'Figma');
    let frontendDeveloper = findBestSpecialist(1, 'Angular');
    let backendDeveloper = findBestSpecialist(2, 'Go');

    console.log('best designer', getInfo.call(designer));
    console.log('best frontendDeveloper', getInfo.call(frontendDeveloper));
    console.log('best backendDeveloper', getInfo.call(backendDeveloper));
}



