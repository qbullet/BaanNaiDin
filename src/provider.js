import axios from 'axios'
const URL = 'https://baannaidin.herokuapp.com'


async function cartProvider (payload) {
    const resp = await axios.post(URL+'/confirm-orders',payload)
    return resp.data
}

export default cartProvider
