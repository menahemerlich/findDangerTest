import input from 'analiza-sync';
import { getPeopleList, getCallRecords } from './server/get.js';
import { writeToFile, repo, searchPeopleByAge, searchPeopleByName } from './file/file.js';

const menu = `1. Get People List\n2. Get Call Records\n3. Search People by Name\n4. Search People by Age\n5. Find Dangerous People\n6. exit`
let flag = true

while (flag) {
    console.log(menu);
    const choice = input('your choice: ')
    switch (choice) {
        case '1':
            const peopleList = await getPeopleList()
            await writeToFile('./data/PEOPLE.json', peopleList)
            break;
        case '2':
            const callRecords = await getCallRecords()
            await writeToFile('./data/TRANSCRIPTIONS.json', callRecords)
            break;
        case '3':
            const name = input('name: ')
            await searchPeopleByName(name)
            break;
        case '4':
            const age = input('age: ')
            await searchPeopleByAge(age)
            break;
        case '5':
            console.log( repo().then(res=>{console.log(res);
            }));
            break;
        case '6':
            flag = false
            break;
    
        default:
            break;
    }
}