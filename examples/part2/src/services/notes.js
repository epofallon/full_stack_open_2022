import axios from 'axios';
const baseUrl = '/api/notes';

let token = null;

const setToken = newToken => {
  token = `bearer ${newToken}`;
};

const getAll = async () =>  {
  const response = await axios.get(baseUrl);

  return response.data;
};

const create = async newObj => {
  const config = { headers: { Authorization: token } };
  const { data } = await axios.post(baseUrl, newObj, config);
  return data;
};

const update = async (id, newObj) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObj);
  return response.data;
};

const operations = { getAll, create, update, setToken };
export default operations;