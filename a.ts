enum PermissionLevel {
    ADMIN = 'administrador',
    TEACHER = 'professor',
    STUDENT = 'aluno',
}

const aluno: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    permissionLevel: {
        type: String,
        enum: Object.values(PermissionLevel),
        required: true,
    },
    Class: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    terms: {
        type: [
            {
                content: { type: Schema.Types.ObjectId, ref: 'Content', required: true },
                bimesters: {
                    type: [{
                        name: string;
                        grades: number[];
                        attendance: number;
                        maxGrade: number;
                    }],
                    default: () =>
                        Array(4).fill({ name: '', grades: [], attendance: 0, maxGrade: 25 }),
                },
            },
        ],
        default: [],
    }, // 4 Bimestres com notas e presenças
})

const ContentSchema: Schema = new Schema({
    name: { type: String, required: true },
    teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const ClassSchema: Schema = new Schema({
    series: { type: String, required: true },
    name: { type: String, required: true },
    students: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Referência aos alunos
    contents: [{ type: Schema.Types.ObjectId, ref: 'Content' }], // Conteúdos ministrados na turma
})
