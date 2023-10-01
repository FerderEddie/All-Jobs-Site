export const saveInLs = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const loadFromLs = (key) => {
  return JSON.parse(localStorage.getItem(key));
};
