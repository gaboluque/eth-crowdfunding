import web3 from './web3';
import Campaign from './build/Campaign.json';

const campaign = (campaignAddress) => new web3.eth.Contract(
  JSON.parse(Campaign.interface),
  campaignAddress
)

export default campaign;