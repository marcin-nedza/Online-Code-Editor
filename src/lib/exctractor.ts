const code = {
  title: "code",
  content: `
    function bla() {
{

content bla
}
}}


export default bla;

`,
};
const code2 = {
  title: "code2",
  content: `
import sratata from ('./sratata')
const cosik=()=>{
contnasdanisd
}
`,
};

const code3 = {
  title: "code3",
  content: `
  import bla from ("./bla")

    function sratata() {
{

content bla
}
}}


export default sratata;

`,

};
const code4 = {
  title: "code4",
  content: `
    function end() {
{

content bla
}
}}


export default end;

`,
};
//stworz klase glowna?
//plik configuracyjny albo opcjew edytorze -> ktory jest main
//stworz array referencji do plikow
//dla kazdego pliku sprawdz content
//sprawdz importy i eksporty i dodaj nazyw zmiennych, funckji do odpowiednich Map
//type Map={name:string,{originFile:string}
//sprawdzaj jakie sa importy
//sprawdzaj sciezke
//dodaj do array of dependency, ktore okresla kolejnsoc wklejania
function splitString(text) {
  return text.split(/\s/).filter((e) => e != "");
}
console.log(splitString(code.content));
let mapOfExports = new Map();
let mapOfImports = new Map();

function lookForExportOrImport(arr, title) {
  arr.map((el, i) => {
    if (el === "export") {
      mapOfExports.set(arr[i + 2], { originFile: title });
    }
    if (el === "import") {
      mapOfImports.set(arr[i + 1], {
        originFile: title,
        targetFile: arr[i + 3].replace(/[('")]/g, ""),
      });
    }
  });
}
function findWhereFunctionIsExported(functionName) {}
function main(arraayOfFiles) {
  //get all files
  arraayOfFiles.map((el) => {
    lookForExportOrImport(splitString(el.content), el.title);
  });
  console.log("exports", mapOfExports);
  console.log("imports", mapOfImports);
}

main([code, code2, code3, code4]);
const str = "(asdasd)";
console.log(str.replace(/[()]/g, ""));
