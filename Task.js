// Всі Require
const fs = require("fs")

// Константи
const filePath = "./Data.txt"

// Функції
function userRegistration(login, password, filePath) {
    let fileContent = `${login},${password}`
    fs.appendFile(filePath, fileContent + '\r\n', () => {
        console.log(`Користувача зареєстровано`)
    })
}

function userLogIn(login, password, filePath) {
     fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error(err)
        }
        else {
            data = data.split('\r\n');
            for (let i = 0; i < data.length; i++) {
                if (login == data[i].split(',')[0]) {
                    if (password == data[i].split(',')[1]) {
                        console.log('Авторизацію пройдено')
                        return
                    } else {
                        console.log('Неправильний пароль')
                        return
                    }
                } else {
                    console.log('Користувача не знайдено')
                    return
                }
            }
        }    
    })
}

// Дані користувача
const login = "User123"
const password = "qwerty123"
const wronglogin = "User555"
const wrongpassword = "12345"

// Запуск
userRegistration(login, password, filePath)
userLogIn(login, password, filePath)
userLogIn(login, wrongpassword, filePath)
userLogIn(wronglogin, password, filePath)