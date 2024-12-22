import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://jato78:Sigma12'@cluster0.gzco2nu.mongodb.net/");
        console.log('Conectado ao MongoDB');
    } catch (error) {
        console.error('Erro ao conectar com o MongoDB', error);
        process.exit(1); // Encerra o processo se não conseguir conectar
    }
};

export default connectDB;
