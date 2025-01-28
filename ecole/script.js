let teachers = [];
let students = [];
let currentId = 1;

// Ajouter un professeur
function addTeacher() {
    const name = document.getElementById('teacherName').value;
    const subject = document.getElementById('teacherSubject').value;
    const email = document.getElementById('teacherEmail').value;

    if (name && subject && email) {
        const teacher = {
            id: currentId++,
            name: name,
            subject: subject,
            email: email
        };
        teachers.push(teacher);
        alert(`Professeur ajouté avec succès! ID: ${teacher.id}`);
    } else {
        alert('Veuillez remplir tous les champs.');
    }
}

// Ajouter un étudiant
function addStudent() {
    const name = document.getElementById('studentName').value;
    const age = parseInt(document.getElementById('studentAge').value);
    const studentClass = document.getElementById('studentClass').value;

    if (name && age && studentClass) {
        const student = {
            id: currentId++,
            name: name,
            age: age,
            class: studentClass
        };
        students.push(student);
        alert(`Étudiant ajouté avec succès! ID: ${student.id}`);
    } else {
        alert('Veuillez remplir tous les champs.');
    }
}

// Afficher les professeurs
function showTeachers() {
    const displayList = document.getElementById('displayList');
    displayList.innerHTML = '';
    teachers.forEach(teacher => {
        const li = document.createElement('li');
        li.textContent = `ID: ${teacher.id}, Nom: ${teacher.name}, Matière: ${teacher.subject}, Email: ${teacher.email}`;
        displayList.appendChild(li);
    });
}

// Afficher les étudiants
function showStudents() {
    const displayList = document.getElementById('displayList');
    displayList.innerHTML = '';
    students.forEach(student => {
        const li = document.createElement('li');
        li.textContent = `ID: ${student.id}, Nom: ${student.name}, Âge: ${student.age}, Classe: ${student.class}`;
        displayList.appendChild(li);
    });
}

// Modifier une entrée
function modifyEntry() {
    const id = parseInt(document.getElementById('modifyId').value);
    const field = document.getElementById('modifyField').value;
    const value = document.getElementById('modifyValue').value;

    let entry = teachers.find(t => t.id === id) || students.find(s => s.id === id);

    if (entry && field && value) {
        if (entry[field] !== undefined) {
            entry[field] = value;
            alert(`Entrée modifiée avec succès!`);
            showTeachers(); // Rafraîchir la liste
            showStudents(); // Rafraîchir la liste
        } else {
            alert('Champ invalide.');
        }
    } else {
        alert('ID, champ ou valeur invalide.');
    }
}