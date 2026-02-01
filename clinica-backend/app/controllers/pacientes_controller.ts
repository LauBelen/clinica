import type { HttpContext } from '@adonisjs/core/http'
import Paciente from '#models/paciente'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

export default class PacientesController {
  
  // --- PACIENTES ---

  async index({ response }: HttpContext) {
    const pacientes = await Paciente.all()
    return response.ok(pacientes)
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['dni', 'nombre', 'apellido', 'fechaNacimiento', 'telefono', 'email'])
      const paciente = await Paciente.create({
        dni: data.dni,
        nombre: data.nombre,
        apellido: data.apellido,
        fechaNacimiento: DateTime.fromISO(data.fechaNacimiento),
        telefono: data.telefono,
        email: data.email,
      })
      return response.created(paciente)
    } catch (error) {
      return response.badRequest({ message: 'Error al crear paciente', error: error.message })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const paciente = await Paciente.findBy('dni', params.dni)
      if (!paciente) return response.notFound({ message: 'Paciente no encontrado' })
      
      const data = request.only(['nombre', 'apellido', 'fechaNacimiento', 'telefono', 'email'])

      // Actualizamos campos básicos
      paciente.nombre = data.nombre
      paciente.apellido = data.apellido
      paciente.telefono = data.telefono
      paciente.email = data.email

      // Manejo seguro de la fecha:
      // Solo la actualizamos si viene un valor y es una fecha válida
      if (data.fechaNacimiento) {
        const nuevaFecha = DateTime.fromISO(data.fechaNacimiento)
        if (nuevaFecha.isValid) {
          paciente.fechaNacimiento = nuevaFecha
        }
      }

      await paciente.save()
      return response.ok(paciente)
    } catch (error) {
      console.error('Error en Update:', error)
      return response.internalServerError({ message: 'No se pudo actualizar el paciente' })
    }
  }

  async destroy({ params, response }: HttpContext) {
    const paciente = await Paciente.findBy('dni', params.dni)
    if (!paciente) return response.notFound({ message: 'Paciente no encontrado' })
    await paciente.delete()
    return response.ok({ message: 'Paciente eliminado' })
  }

  // --- MÉTODOS DE NOTAS CORREGIDOS ---

  async getNotas({ params, response }: HttpContext) {
    try {
      const notas = await db
        .from('notas')
        .where('paciente_dni', params.dni)
        .orderBy('id', 'desc')

      return response.ok(notas)
    } catch (error) {
      console.error("Error al traer notas:", error)
      return response.internalServerError({ message: 'Error al obtener notas' })
    }
  }

  async storeNota({ request, response }: HttpContext) {
    try {
      const data = request.only(['paciente_dni', 'texto'])
      
      if (!data.texto || !data.paciente_dni) {
        return response.badRequest({ message: 'Faltan datos (DNI o texto)' })
      }

      await db.table('notas').insert({
        paciente_dni: String(data.paciente_dni),
        texto: data.texto
      })

      return response.created({ message: 'Nota guardada con éxito' })
    } catch (error) {
      console.error("Error al guardar nota:", error)
      return response.internalServerError({ 
        message: 'Error de base de datos', 
        error: error.message 
      })
    }
  }

  async destroyNota({ params, response }: HttpContext) {
    try {
      await db.from('notas').where('id', params.id).delete()
      return response.ok({ message: 'Nota eliminada' })
    } catch (error) {
      return response.internalServerError({ message: 'No se pudo eliminar la nota' })
    }
  }
}