import factory from "../ethereum/factory";
import {Button, Card, CardContent, CardGroup, CardHeader} from "semantic-ui-react";

export async function getServerSideProps(context) {
  const campaigns = await factory.methods.getDeployedCampaigns().call();

  return {
    props: {
      campaigns
    },
  }
}

const NewCampaignPage = ({ campaigns }) => {

  const renderCampaigns = () => {
    const items = campaigns.map((address) =>( {
      header: address,
      description: <a>View Campaign</a>,
      fluid: true
    }));

    return <CardGroup items={items} />
  }

  return (
    <div>
      <h3>Open campaigns</h3>
      <Button floated="right" content="Create campaign" icon="add" primary />
      {renderCampaigns()}
    </div>
  )
}

export default NewCampaignPage;