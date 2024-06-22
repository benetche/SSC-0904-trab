export default function generateUniqueId() {
  const timestamp = new Date().getTime(); // Obtém o timestamp atual em milissegundos
  const randomNum = Math.floor(Math.random() * 1000); // Gera um número aleatório entre 0 e 999

  return `${timestamp}_${randomNum}`;
}
