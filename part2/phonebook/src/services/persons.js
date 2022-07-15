import axios from 'axios';
const baseUrl = '/api/persons';


const getAll = () => {
  const data = axios.get(baseUrl).then(response => response.data);
  return data;
};

const create = newPerson => {
  const data = axios.post(baseUrl, newPerson).then(response => response.data);
  return data;
}

const deletePerson = id => {
  axios.delete(`${baseUrl}/${id}`);
}

const update = (id, newObj) => {
  let data = axios.put(`${baseUrl}/${id}`, newObj).then(({data}) => data);
  return data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, create, update, deletePerson };