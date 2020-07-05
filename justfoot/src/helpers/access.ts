export function userOnly({ authentication: { item } }) {
  return !item ? false : item.isAdmin ? true : { id: item.id };
}

export function restrictedToUser({ authentication: { item } }) {
  return !item ? false : item.isAdmin ? true : { createdBy: item.id };
}
