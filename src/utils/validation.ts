// CHECKME Можно было через метод match и через цикл пройтись по каждому регулярному выражению, не знаю почему я так не сделал :P

export function validateEmail(email:string) {
    const regex = new RegExp(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)
    return regex.test(email)
}

export function validatePassword(password:string) {
    const regex = new RegExp("^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{4,})")
    return regex.test(password)
}
