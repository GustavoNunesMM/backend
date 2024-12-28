import mongoose, { Schema, model, Document } from 'mongoose';

enum PermissionLevel {
    ADMIN = 'administrador',
    TEACHER = 'professor',
    STUDENT = 'aluno',
}
// Interface para usuário
interface IUser extends Document {
    username: string;
    password: string;
    email: string;
    permissionLevel: PermissionLevel;
    savedSettings: object;
    ClassID: mongoose.Types.ObjectId;
}

// Schema de Usuário
const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    permissionLevel: {
        type: String,
        enum: Object.values(PermissionLevel),
        required: true,
    },
    ClassID: { type: Schema.Types.ObjectId, ref: 'Class' },
    savedSettings: { type: Schema.Types.Mixed, default: {} },
});

const UserModel = model<IUser>('User', UserSchema);

// ==============================
// Interface e Schema: Conteúdo
// ==============================

// Interface para Conteúdo
interface IContent extends Document {
    name: string;
    teacher: mongoose.Types.ObjectId; // Relacionado ao usuário (professor)
}

// Schema de Conteúdo
const ContentSchema: Schema = new Schema({
    name: { type: String, required: true },
    teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const ContentModel = model<IContent>('Content', ContentSchema);

// ==============================
// Interface e Schema: Turma
// ==============================

// Interface para Turma
interface IClass extends Document {
    series: string;
    name: string;
    students: mongoose.Types.ObjectId[]; // Lista de IDs de alunos
    contents: IContent[];
}

// Schema de Turma
const ClassSchema: Schema = new Schema({
    series: { type: String, required: true },
    name: { type: String, required: true },
    students: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Referência aos alunos
    contents: [{ type: ContentSchema }], // Conteúdos ministrados na turma
});

const ClassModel = model<IClass>('Class', ClassSchema);

// ==============================
// Interface e Schema: Bimestre
// ==============================

// Interface para Bimestre
interface ITerm extends Document {
    name: string;
    grades: number[];
    attendance: number;
    maxGrade: number;
}

// Schema de Bimestre
const TermSchema: Schema = new Schema({
    name: { type: String, required: true },
    grades: [{ type: Number, default: [] }],
    maxGrade: {type: Number, default: 25},
    attendance: { type: Number, default: 0 },
});

const TermModel = model<ITerm>('TermSchema', TermSchema)

// ==============================
// Interface e Schema: Relação Classe x Aluno por Bimestres
// ==============================

// Interface para Relacionamento Classe x Aluno
interface IStudentClass extends Document {
    student: mongoose.Types.ObjectId; // Relacionado ao aluno
    Class: mongoose.Types.ObjectId; // Relacionado ao Classe
    terms: { content: mongoose.Types.ObjectId; bimesters:ITerm[] }[]; // Dividido em 4 bimestres
}

// Schema para a relação
const StudentClassSchema: Schema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    Class: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    terms: {
        type: [
            {
                content: { type: Schema.Types.ObjectId, ref: 'Content', required: true },
                bimesters: {
                    type: [TermSchema],
                    default: () =>
                        Array(4).fill({ name: '', grades: [], attendance: 0, maxGrade: 25 }),
                },
            },
        ],
        default: [],
    }, // 4 Bimestres com notas e presenças
});

const StudentClassModel = model<IStudentClass>('StudentClass', StudentClassSchema);

// ==============================
// Exportando os Modelos
// ==============================
export { UserModel, ClassModel, ContentModel, StudentClassModel, TermModel };