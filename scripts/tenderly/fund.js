/**
 * This script is used to fund an account with 
 * 1000 native ether and 1000 ERC20 tokens on Tenderly.
 */

require('dotenv').config();
const axios = require('axios');

const toAddress = "0xE35344894b53dCC15C87CC5a6B80d5f6aa190858"; // edit this address
const erc20Address = "0xcE11e14225575945b8E6Dc0D4F2dD4C570f79d9f"; // OLAS on Gnosis

const setBalance = async () => axios.post(process.env.DEV_RPC, {
    jsonrpc: '2.0',
    method: 'tenderly_setBalance',
    params: [
        toAddress,
        "0x3635C9ADC5DEA00000"
    ],
    jsonrpc: '2.0',
})

const setErc20Balance = async () => axios.post(process.env.DEV_RPC, {
    jsonrpc: '2.0',
    method: 'tenderly_setErc20Balance',
    params: [
        erc20Address,
        toAddress,
        "0x3635C9ADC5DEA00000"
    ],
})

const main = async () => {
    console.log('Funding account...');
    console.log('Setting balance...');
    await setBalance().then(console.log);
    console.log('Setting ERC20 balance...');
    await setErc20Balance().then(console.log);
}

main();