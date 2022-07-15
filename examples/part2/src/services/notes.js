import axios from 'axios';
const baseUrl = '/api/notes';

const getAll = async () =>  {
  const response = await axios.get(baseUrl);

  const nonExisting = {
    id: 10000,
    content: 'FAKE note',
    date: '2019-05-30T17:30:31.098Z',
    important: true,
  };

  return response.data.concat(nonExisting);
};

const create = async newObj => {
  const { data } = await axios.post(baseUrl, newObj);
  return data;
};

const update = async (id, newObj) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObj);
  return response.data;
};

const operations = { getAll, create, update, };
export default operations;