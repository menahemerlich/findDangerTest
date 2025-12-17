 
export async function getPeopleList() {
    try {
        const res = await fetch('https://spiestestserver.onrender.com/people')
        const peopleList = await res.text()
        return peopleList
    } catch (error) {
        console.error(error);
    }
}

export async function getCallRecords() {
    try {
        const res = await fetch('https://spiestestserver.onrender.com/transcriptions')
        const callRecords = await res.text()
        return callRecords
    } catch (error) {
        console.error(error);
    }
}

