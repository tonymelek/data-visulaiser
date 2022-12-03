const attendance = require('./attendance.json');

const dynamicFilter = () => {
    const filters = [{ grade: 'G2' }, { role: 'Servant' }]

    return filters.reduce((a, b) => {
        return a.filter(v => v[Object.keys(b)[0]] === Object.values(b)[0])
    }, attendance)

}
console.log(dynamicFilter().map(v => `${v.first} ${v.last}`));