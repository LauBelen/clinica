import type { HttpContext } from '@adonisjs/core/http'
import Paciente from '#models/paciente'
import { DateTime } from 'luxon'

export default class PacientesController {
  // LISTAR
  async index({ response }: HttpContext) {
    const pacientes = await Paciente.all()
    return response.ok(pacientes)
  }

  // CREATE
  async store({ request, response }: HttpContext) {
    const data = request.only([
      'dni',
      'nombre',
      'apellido',
      'fechaNacimiento',
      'telefono',
      'email',
    ])

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

  // UPDATE
  async update({ params, request, response }: HttpContext) {
    const paciente = await Paciente.findBy('dni', params.dni)

    if (!paciente) {
      return response.notFound({ message: 'Paciente no encontrado' })
    }

    const data = request.only([
      'nombre',
      'apellido',
      'fechaNacimiento',
      'telefono',
      'email',
    ])

    if (data.fechaNacimiento) {
      data.fechaNacimiento = DateTime.fromISO(data.fechaNacimiento)
    }

    paciente.merge(data)
    await paciente.save()

    return response.ok(paciente)
  }

  // DELETE
  async destroy({ params, response }: HttpContext) {
    const paciente = await Paciente.findBy('dni', params.dni)

    if (!paciente) {
      return response.notFound({ message: 'Paciente no encontrado' })
    }

    await paciente.delete()
    return response.ok({ message: 'Paciente eliminado' })
  }
}
