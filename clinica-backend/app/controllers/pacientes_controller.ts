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
  }

  async update({ params, request, response }: HttpContext) {
    const paciente = await Paciente.findBy('dni', params.dni)
    if (!paciente) return response.notFound({ message: 'Paciente no encontrado' })
    
    const data = request.only(['nombre', 'apellido', 'fechaNacimiento', 'telefono', 'email'])
    if (data.fechaNacimiento) data.fechaNacimiento = DateTime.fromISO(data.fechaNacimiento)

    paciente.merge(data)
    await paciente.save()
    return response.ok(paciente)
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
      // Buscamos las notas usando el DNI que viene en la URL
      const notas = await db
        .from('notas')
        .where('paciente_dni', params.dni)
        .orderBy('id', 'desc') // Ordenar por ID es más seguro que por fecha

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

      // Insertamos asegurando que el DNI se trate como String
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