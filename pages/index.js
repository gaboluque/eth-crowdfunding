import factory from "../ethereum/factory";
import {Button, Card, CardContent, CardGroup, CardHeader} from "semantic-ui-react";
import {useRouter} from "next/router";
import Link from "next/link";

export async function getServerSideProps(context) {
  const campaigns = await factory.methods.getDeployedCampaigns().call();

  return {
    props: {
      campaigns
    },
  }
}

const CampaignsPage = ({ campaigns }) => {
  const router = useRouter();

  const goToNewCampaign = () => {
    router.push("/campaigns/new");
  }

  const renderCampaigns = () => {
    const items = campaigns.map((address) =>( {
      header: address,
      description: <Link href={`campaigns/${address}`}>View Campaign</Link>,
      fluid: true
    }));

    return <CardGroup items={items} />
  }

  return (
    <div>
      <h3>Open campaigns</h3>
      <Button floated="right" content="Create campaign" icon="add" primary onClick={goToNewCampaign} />
      {renderCampaigns()}
    </div>
  )
}

export default CampaignsPage;