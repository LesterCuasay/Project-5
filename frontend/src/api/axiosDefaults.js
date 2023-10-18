import axios from "axios";

// axios.defaults.baseURL = ''
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'
axios.defaults.withCredentials = true;