// Всі Require
const fs = require("fs")
const prompt = require("prompt-sync")()
const nodemailer = require("nodemailer")
const crypto = require('crypto')
const otp = require("otplib")

// Константи
const filePath = "./Data.txt"

// Дані для відправки листів
let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: "serhii.o.oleniak@ukd.edu.ua",
        pass: "V0aOi7KcECdYGRFd",
        clientId: "912055313549-jh5d5lan57vn8vvu7lf52fr2ga6ouc2a.apps.googleusercontent.com",
        clientSecret: "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",
        refreshToken: "1//04iXLPACk7rzUCgYIARAAGAQSNwF-L9Ir6o5DB5J3Iksd-2eRilU1JWI9ECi1RiuRhpp34kn0573ODdymw0yuyvERTLMX-JwaPoo"
      }
});

// Функції
function mailOptions(mailTo, mailSubject, mailText) {
    let mailOptions = {
      from: "serhii.o.oleniak@ukd.edu.ua",
      to: mailTo,
      subject: mailSubject,
      text: mailText
    }
    return mailOptions
}

function userRegistration(filePath) {
    console.log("Почато процес реєстрації")
    let data = fs.readFileSync(filePath, 'utf8')
    data = data.split('\r\n')
    while (true) {
        let email = prompt("Введіть адресу вашої пошти: ")
        for (let i = 0; i < data.length; i++) {
            if (email == data[i].split(',')[0]) {
                console.log(`Користувач ${email} вже зареэстрований`)
                return
            } else {
                let password = prompt("Введіть пароль: ")
                const salt = crypto.randomBytes(16).toString('hex')
                const token = otp.authenticator.generate(salt)
                console.log("Відправляємо лист підтвердження")
                transporter.sendMail(mailOptions(email, "Підтвердження реєстрації", `Код підтвердження ${token}`), function (err) {
                    if (err) {
                        console.log("Error " + err);
                        return
                    } else {
                        console.log("Лист підтвердження успішно відправлено")
                        for (let i = 2; i >= 0; i--) {
                            if (prompt("Введіть код підтвердження: ") == token) {
                                let fileContent = `${email},${password}`
                                fs.appendFile(filePath, fileContent + '\r\n', () => {
                                    console.log(`Користувача зареєстровано`)
                                })
                                break
                            } else {
                                console.log(`Неправильний код підтвердження. Залишилось спроб ${i}`)
                                if (i == 0) {
                                    console.log(`Не вдалося зареєструвати користувача`)
                                    break
                                }
                            }
                        }
                    }
                });
            }
        }
    }
}

const userLogIn = (filePath) => {
    return new Promise ((resolve) => {
        console.log("Почато процес авторизації")
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                console.error(err)
            }
            else {
                data = data.split('\r\n')
                while (true) {
                    let email = prompt("Введіть адресу вашої пошти: ")
                    for (let i = 0; i < data.length; i++) {
                        if (email == data[i].split(',')[0]) {
                            for (let j = 2; j >= 0; j--) {
                                let password = prompt("Введіть пароль: ")
                                if (password == data[i].split(',')[1]) {
                                    console.log('Авторизацію пройдено')
                                    resolve();
                                    return
                                } else {
                                    console.log(`Неправильний пароль Залишилось спроб ${j}`)
                                    if (j == 0) {
                                    console.log(`Авторизацію не пройдено`)
                                    resolve();
                                    return
                                    }
                                }
                            }
                        }
                    }
                    console.log(`Користувача ${email} не знайдено`)
                }
            } 
        })
    })
}

function userPaswordReset(filePath) {
    console.log("Почато процес скидання паролю")
    let data = fs.readFileSync(filePath, 'utf8')
    data = data.split('\r\n')
    while (true) {
        let email = prompt("Введіть адресу вашої пошти: ")
        for (let i = 0; i < data.length; i++) {
            if (email == data[i].split(',')[0]) {
                const salt = crypto.randomBytes(16).toString('hex')
                const token = otp.authenticator.generate(salt)
                console.log("Відправляємо лист підтвердження")
                transporter.sendMail(mailOptions(email, "Скидання паролю", `Код підтвердження ${token}`), function (err) {
                    if (err) {
                        console.log("Error " + err);
                        return
                    } else {
                        console.log("Лист підтвердження успішно відправлено")
                        for (let j = 2; j >= 0; j--) {
                            if (prompt("Введіть код підтвердження: ") == token) {
                                let newPassword = prompt("Введіть новий пароль: ")
                                data[i] = `${email},${newPassword}`;
                                fs.writeFileSync(filePath, data.join('\r\n'))
                                console.log(`Пароль успішно змінено на ${newPassword}`)
                                return
                            } else {
                                console.log(`Неправильний код підтвердження. Залишилось спроб ${j}`)
                                if (j == 0) {
                                    console.log(`Не вдалося підтвердити користувача`)
                                    return
                                }
                            }
                        }
                    }
                });
                return;
            }
        }
       console.log(`Користувача ${email} не знайдено`)
    }

}

// Запуск
userRegistration(filePath)
userLogIn(filePath).then(() => {
    userPaswordReset(filePath);
})