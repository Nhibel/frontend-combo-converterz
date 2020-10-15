import axios from 'axios';

let baseURL;

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  baseURL = 'http://localhost:3000';
} else {
  baseURL = 'https://rocky-mesa-96901.herokuapp.com/';
}

export const HTTP = axios.create({
  baseURL: baseURL
});
