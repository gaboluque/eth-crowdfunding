import factory from "../ethereum/factory";

export async function getServerSideProps(context) {
  const campaigns = await factory.methods.getDeployedCampaigns().call();

  return {
    props: {
      campaigns
    },
  }
}

const NewCampaignPage = ({ campaigns }) => {
  console.log(campaigns);

  return (
    <div>Index</div>
  )
}

export default NewCampaignPage;