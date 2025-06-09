/**
 * get initial from a string. returns empty string if empty string
 * ex 'Doctor Specialist One' => 'DO'
 * @param str
 */
export const getInitial: (str: string) => string = (str) => {
  const allInitials = str.trim().split(' ')

  if (allInitials.length === 0) {
    return ''
  }

  if (allInitials.length === 1) {
    return allInitials[0].charAt(0)
  }

  return `${allInitials[0].charAt(0).toUpperCase()}${allInitials[allInitials.length - 1].charAt(0).toUpperCase()}`
}
