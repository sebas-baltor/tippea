export function toUtcIso(local: string) {
  // local viene como "YYYY-MM-DDTHH:mm"
  // lo convertimos a ISO UTC
  const d = new Date(local)
  // si el input carece de zona, el Date lo toma como local y lo convierte automáticamente a UTC en toISOString
  return d.toISOString()
}