import Campaign from "../../../ethereum/campaign";
import {Button, CardGroup, Form, Input, Grid, Message} from "semantic-ui-react";
import {startCase} from 'lodash';
import {useState} from "react";
import web3 from "../../../ethereum/web3";
import {useRouter} from "next/router";

export async function getServerSideProps(context) {
  const campaignAddress = context.params.address;
  const campaign = await Campaign(campaignAddress).methods.getSummary().call();

  return {
    props: {
      address: campaignAddress,
      campaign: {
        minimumContribution: campaign[0],
        balance: campaign[1],
        requestsCount: campaign[2],
        approversCount: campaign[3],
        manager: campaign[4],
      }
    },
  }
}


const CampaignShow = ({campaign, address}) => {
  const router = useRouter();
  const [amount, setAmount] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const items = Object.entries(campaign).map(([key, value]) => ({
    header: key === "balance" ? `${web3.utils.fromWei(value, "ether")} ETH` : value,
    description: startCase(key),
    style: {overflowWrap: 'break-word'}
  }))

  const handleChangeAmount = ({target}) => {
    setAmount(target.value);
  }

  const onContribute = async () => {
    const campaign = Campaign(address);

    try {
      setLoading(true);
      setError("");

      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(amount, "ether")
      });

      router.replace(`/campaigns/${address}`);
    } catch (err) {
      console.log(err)
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const goToRequests = () => {
    router.push(`/campaigns/${address}/requests`);
  }

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={8}>
          <CardGroup items={items}/>
        </Grid.Column>
        <Grid.Column width={8}>
          <Form onSubmit={onContribute} error={!!error}>
            <Form.Field>
              <label htmlFor="amount">Amount to contribute</label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={handleChangeAmount}
                label="ether"
                labelPosition="right"
              />
            </Form.Field>
            <Message error header="Oops!" content={error}/>
            <Button loading={loading} primary>Contribute!</Button>
            {!!loading && <Message
              content="We are processing your contribution! This might take a while."/>}
          </Form>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Button primary onClick={goToRequests}>View requests</Button>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

CampaignShow.defaultProps = {};


export default CampaignShow;