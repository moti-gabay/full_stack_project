
export function isAdult(age: number) {
    return age >= 18;
}

export function makeUser(name: string) {
    return { name, role: "user", active: true }
}