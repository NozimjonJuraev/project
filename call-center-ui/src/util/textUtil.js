export default function firstToUpper(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}