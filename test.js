/*
Uwagi:
1. Sortowanie działa w tej chwili tylko w jedną stronę, dla chętnych mozna dodać sortowanie takze w drugą stronę. Trzeba wtedy dodać
    jakiś globalny znacznik sortowania, w którym będzie przechowywana w obiekcie informacja na temat tego po jakim polu sortujemy oraz
    w którą stronę. 
2. Jeśli ktoś chciałby mieć tu lepsze rozwiązanie, to po dodaniu funkcjonalności z punktu pierwszego, mozemy nieco przebudować funkcję
    sortData() i wykonywać ją po prostu w funkcji addContent() na początku. Wtedy po kliknięciu na header nie wywołujemy od razu sortowania,
    ale wywołujemy funkcję zamieniającą informację o globalnym sortowaniu na nową, a następnie wywołującą funkcję addContent(), zeby odświerzyć
    naszą tabelę.
3. Mozna tez dodać przechowywanie tych danych w localStorage, bądź w cookies, wtedy pozostaną takie same po wyjściu ze strony i ponownym jej
    odpaleniu. Trzeba pamiętać, zeby usunąć wtedy serverData z tego pliku, dodać to manualnie do ciasteczek, czy localStorage i potem juz
    pobierać stamtąd przy starcie aplikacji.
*/

//Dane z serwera
const serverData = [
    {name: 'kupić kwiaty', time: 300},
    {name: 'dodać css', time: 240},
    {name: 'dodać header', time: 540},
    {name: 'upiec naleśniki', time: 900},
];

//Nazwy nagłówków w headerze
const headerData = ['nazwa', 'czas', 'usuń'];

//Funkcja do sortowania danych
function sortData(index) {
    const keys = Object.keys(serverData[0]); //zapisujemy klucze obiektu, zeby móc je wykorzystać przy sortowaniu
    const sortedData = serverData.sort((el1, el2) => {
        const toCompare1 = el1[keys[index]]; //wyciągamy pierwszy element do porównania
        const toCompare2 = el2[keys[index]]; //wyciągamy drugi element do porównania
        return toCompare1 > toCompare2 ? 1 : -1       //Soerujemy. O tym jak działa funkcja sort mona przeczytać tutaj:https://developer.mozilla.org/pl/docs/Web/JavaScript/Referencje/Obiekty/Array/sort
    });
    addContent(sortedData);
}

//Funkcja, która dodaje header
function addHeader() {
    const tableHeader = document.getElementsByClassName('table-header')[0]; //bierzemy div - header tabeli ze strony
    headerData.forEach((item, index) => {
        const newCell = document.createElement('div');   //tworzymy nowy element div
        newCell.classList.add('table-cell');    //nadajemy mu klasę
        newCell.innerHTML = item;   //dodajemy do niego wnętrze
        if(index === 0 || index ===1) { // tylko dla elementów nazwa i czas. Nie chcemy sortować po przycisku usuń, to bez sensu
            newCell.classList.add('table-cell-clickable'); // Dodajemy klasę, która doda nam clicker:pointer; na komórkach z onclickiem
            newCell.onclick = () => sortData(index) //dodajemy na onclicky nowej komórki funkcję sortującą dane
        }
        tableHeader.appendChild(newCell); // Dodajemy nowy element do headera
    })
};

//Funkcja, która zamienia dane z serwera na dane do tabeli
function serverDataToTableData(sData) {
    const deleteAdded = sData.map(item => {
        return {...item, delete: 'delete'} //tworzymy nowy obiekt o polach {name: '', time: '', delete: ''}
    });
    return deleteAdded.map(item => Object.values(item)); // mapujemy tablicę naszych obiektów do tablicy tablic.
}

function deleteElement(index) {
    console.log(serverData, index);
    serverData.splice(index, 1); //Usuwamy element z tablicy
    addContent(serverData); // Renredujemy tabelę raz jeszcze
}

//Funkcja, która dodaje kolejne rzędy do tabeli
function addContent(sData) {
    const tableData = serverDataToTableData(sData); //zamieniamy dane z serwera na dane do tabeli
    const tableContentElement = document.getElementsByClassName('table-content')[0]; //bierzemy z dokumentu element o klasie table-content
    tableContentElement.innerHTML = '';
    tableData.forEach((dataSet, i) => {
        const newRow = document.createElement('div'); // tworzymy nowy rząd w tabeli
        newRow.classList.add('table-row');  // dodajemy do niego klasę
        dataSet.forEach(item => {
            const newCell = document.createElement('div'); // tworzymy nową komórkę w tabeli
            newCell.classList.add('table-cell');    // dodajemy do niej klasę
            if(item === 'delete') {
               const newButton = document.createElement('button'); // tworzymy nowy button
               newButton.innerHTML = 'delete'; // dodajemy napis w buttonie 'delete'
               newButton.onclick = () => deleteElement(i); // dodajemy funkcję do przycisku
               newCell.appendChild(newButton);  // dodajemy przycisk do naszej komórki
            } else {
                newCell.innerHTML = item; // dodajemy do niej 'wnętrze' - dane
            }
            newRow.appendChild(newCell); // dodajemy naszą komórkę do nowego rzędu
        });
        tableContentElement.appendChild(newRow); // dodajemy nowy rząd do tabeli
    });
}

// Dodawanie nowego zadania
function onTaskAdd() {
    const newName = document.getElementById('taskName').value; // bierzemy z dokumentu wartość inputa z imieniem
    const newTime = document.getElementById('taskTime').value; // bierzemy z dokumentu wartość inputa z czasem
    serverData.push({name: newName, time: newTime}); // dodajemy nowe zadanie do tablicy z danymi
    addContent(serverData); // Ponownie renderujemy tablicę, tym razem z nowymi danymi
}

addHeader();
addContent(serverData);