import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  direccion: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  ciudad: {
    type: String,
    default: ''
  }
  
  /*telefono: {
    type: String,
    default: ''
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo', 'pendiente'],
    default: 'activo'
  }*/
}, {
  timestamps: true
});

// Índice para búsquedas más rápidas
clientSchema.index({ codigo: 1 });

export default mongoose.model('Clients', clientSchema);