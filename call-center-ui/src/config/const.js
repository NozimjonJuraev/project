export const testServer = process.env.NODE_ENV === "development" ? true : false;   // agar test serverga qo'yilsa true, real serverga qo'yiladigan bo'lsa false
export const apiUrl = (testServer ? "http://10.15.58.38:8080" /*"http://localhost:8080"*/ : "http://call-center-ws.lan");

export const dateFormat = "DD.MM.YYYY";
export const pageSize = 20;
export const amountList = [
    {
        val: 1000,
        title: "минг.сўм"
    },
    {
        val: 1000000,
        title: "млн.сўм"
    },
    {
        val: 1000000000,
        title: "млрд.сўм"
    },
]

export const months = [
    {value: 1, name: "Январь"},
    {value: 2, name: "Февраль"},
    {value: 3, name: "Март"},
    {value: 4, name: "Апрель"},
    {value: 5, name: "Май"},
    {value: 6, name: "Июнь"},
    {value: 7, name: "Июль"},
    {value: 8, name: "Август"},
    {value: 9, name: "Сентябрь"},
    {value: 10, name: "Октябрь"},
    {value: 11, name: "Ноябрь"},
    {value: 12, name: "Декабрь"}
];