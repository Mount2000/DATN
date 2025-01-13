export function dateToSecond(time){
    return new Date(time).getTime()
}
export function camelToSpace(str) {
    const newWord = str
      .replace(/([A-Z])/g, " $1") // Add a space before uppercase letters
      .toLowerCase()              // Convert the entire string to lowercase
      .trim();                    // Remove leading/trailing spaces
    return newWord.slice(0, 1).toUpperCase() + newWord.slice(1)
  }