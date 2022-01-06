import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0xde88F9288B447e88E528CD9Eded06A9Ba36Ea2bc'
)

export default instance;