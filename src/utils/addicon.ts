export function addIcon(jobPosition: any) {
  let icon = ''
  switch (jobPosition) {
    case 'Guardia':
      icon = 'iconos/guardia.png'
      break
    case 'guardia':
      icon = 'iconos/guardia.png'
      break
      case 'Guardia De Estacionamiento':
        icon = 'iconos/parking.png'
        break
    case 'Inspector Pipem Ac':
      icon = 'iconos/inspector.png'
      break
    case 'Inspector Hbs':
      icon = 'iconos/inspector.png'
      break
    case 'Inspector Soc':
      icon = 'iconos/inspector.png'
      break
    case 'Asistente De Facilitación':
      icon = 'iconos/asistente.png'
      break
    case 'Supervisor':
      icon = 'iconos/jefe.png'
      break
    case 'Jefe De Servicio':
      icon = 'iconos/jefe.png'
      break
    case 'Binomio Canino':
      icon = 'iconos/canino.png'
      break
    case 'Guardia Ssu':
      icon = 'iconos/guardia.png'
      break
  }
  return icon
}
