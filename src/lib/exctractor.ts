
const code = `
    function bla() {
{

content bla
}
}}
`;

//zliczaj brackety aby znalezc zamykajacy
// args = array
// bierzemy array, dzielismy go
// szukamy slow klucz
// jak jest slowo klucz to sprawdzamy index bracket otwierajacego
// sparwdzamy indeks brakcet zamykajacego
// dodajeym do odpowiedniej mapy nazwe i definicje
function splitString(text) {
  return text.split(/\s/).filter((e) => e != "");
}

function lookForKeyword(arr, keyword) {
  const indexes = [];
  arr.map((el, i) => {
    if (el === keyword) {
      indexes.push(i); }
  });
  return indexes;
}
function ifStrHasBrakcet(str, bracket) {
  if (str.includes(bracket)) {
    return true;
  }
  return false;
}
function getInsideContent(arr, startIndex) {
  let counter = 0;
  for (let i = startIndex + 1; i < arr.length; i++) {
    console.log(arr[i]);
    if(ifStrHasBrakcet(arr[i], '{')){
            counter++;
        }
    if(ifStrHasBrakcet(arr[i], '}')){
            counter--;
        }
  }
    console.log('cccc',counter)
}
export default function mapCodeString(code) {
  const codeArray = splitString(code);
  // console.log(codeArray)
  const functionIndexes = lookForKeyword(codeArray, "function");
  // console.log(functionIndexes)
  functionIndexes.map((el) => {
    // console.log('ASDASD',ifStrHasBrakcet(codeArray[el + 1], '{'))
    getInsideContent(codeArray, el);
  });
}
mapCodeString(code);
