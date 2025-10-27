const student = {
    name: "Andora Korusa",
    contact: {
        email: "andora@gmail.com",
        phone: "55511122",
        address: {
            street: "123 Tori Tänav",
            city: "Tallinn",
            country: "Esutonia",
        }
    },
    courses: ["Math", "Ceramics"]
};

console.log(student.contact.email);
console.log(student.contact.address?.city);
console.log(student.emergency?.phone);