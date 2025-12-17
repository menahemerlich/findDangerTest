import fs from 'fs';

export async function writeToFile(fileName, data) {
    fs.writeFile(fileName, data, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('File written successfully');
    })
}

export async function readFile(fileName) {
    return new Promise ((res, rej) => {
        fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        res(JSON.parse(data))
        })
    });
}

export async function searchPeopleByName(name) {
    let PeopleList
    await readFile('../data/PEOPLE.json').then(res=>{PeopleList = res})
    for (const people of PeopleList) {
        if (people.name.toUpperCase() === name.toUpperCase()){
            console.log(people);
        }
    }console.log('Not found')
     
}

export async function searchPeopleByAge(age) {
    let PeopleList
    await readFile('../data/PEOPLE.json').then(res=>{PeopleList = res})
    for (const people of PeopleList) {
        if (people.age == age){
            console.log(people);
        }
    }console.log('Not found')
     
}

export function dangerLevelByText(searcTtext){
    let dangerLevel = 0
    let text = searcTtext.replaceAll(',', '')
    text = text.replaceAll('.', '')
    text = text.split(' ')
    for (const word of text) {
        if (word.toLowerCase()  === 'death' || word.toLowerCase() === 'knife' || word.toLowerCase()  === 'bomb' || word.toLowerCase()  === 'attack'){
            dangerLevel += 1
        }
    }
    return dangerLevel
}

export async function findDangerousPeople() {
    let callRecords
    let PeopleList
    let dangerLevel = 0
    let dangerByAge = {}
    const dangerByAgeList = []
    const dangerByAgeList1 = []
    const ageList = []
    let averageDanger = {}
    const averageList = []
    await readFile('../data/TRANSCRIPTIONS.json').then(res=>{callRecords = res})
    await readFile('../data/PEOPLE.json').then(res=>{PeopleList = res})
    for (const callRecord of callRecords){
        if (!ageList.includes(callRecord.age)){
            ageList.push(callRecord.age)
        }
    }
    for (const age of ageList) {
        dangerByAge[age] = []
        dangerByAgeList.push(dangerByAge)
        dangerByAge = {}
    }
    for (const age of dangerByAgeList) {
        const result = Object.entries(age);
        dangerByAgeList1.push(result)
    }
    for (const callRecord of callRecords) {
        dangerLevel = dangerLevelByText(callRecord.content)
        if (dangerLevel > 0){
            for (const age of dangerByAgeList1) {                
                if (callRecord.age == age[0][0]){
                    age[0][1].push(dangerLevel)
                }
            }
        }
    }   
    for (const age of dangerByAgeList1) {
        let sum = 0
        if (age[0][1].length > 0){
            for (let i = 0; i < age[0][1].length; i++) {
                sum += age[0][1][i]
            }
            averageDanger[age[0][0]] = sum / age[0][1].length
            averageList.push(averageDanger)
            averageDanger = {}
        }   
        }
    const sortedList = []
    for (const age of averageList) {
        const sorted = Object.entries(age)
        sortedList.push(sorted)
    }
    sortedList.sort((a, b) => a[0][1] - b[0][1] )
    const dangersAge = []
    for (let i = 0; i < 3; i++) {
        dangersAge.push(sortedList.pop()[0][0])
    }
    const dangers = []
    for (const people of PeopleList){
        if (people.age == Number(dangersAge[0]) || people.age == Number(dangersAge[1]) || people.age == Number(dangersAge[2])){
            dangers.push(people)
        }
    }
    const dangersStr = JSON.stringify(dangers);
    return dangersStr
}

export async function repo() {
    const dangersStr = await findDangerousPeople()
    try {
        const res = await fetch(`https://spiestestserver.onrender.com/report?data=${dangersStr}`)
        const data = await res.text()        
        return data;
    } catch (error) {
        return error;
    }
}






















