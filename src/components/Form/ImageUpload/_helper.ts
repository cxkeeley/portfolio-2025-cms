const getImage = (file: File): Promise<HTMLImageElement> => {
  const image = new Image()
  return new Promise((resolve, reject) => {
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (er) => reject(er.error))
    image.src = URL.createObjectURL(file)
  })
}

export { getImage }
