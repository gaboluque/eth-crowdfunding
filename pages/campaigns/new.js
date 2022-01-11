import {Button, Form, Input, Message} from "semantic-ui-react";
import {useState} from "react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import {useRouter} from "next/router";

const NewCampaign = () => {
  const [minContribution, setMinContribution] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(undefined);

      const accounts = await web3.eth.getAccounts();

      await factory.methods
        .createCampaign(minContribution)
        .send({ from: accounts[0] });

      router.push("/");

    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3>Create campaign</h3>
      <Form onSubmit={onSubmit} error={!!error}>
        <Form.Field>
          <label htmlFor="minContribution">Minimum contribution</label>
          <Input value={minContribution}
                 onChange={({target}) => setMinContribution(target.value)}
                 label="Wei"
                 placeholder="E.g 1000"
                 labelPosition="right"
                 type="number"
                 id="minContribution"
          />
        </Form.Field>
        <Message error header="Oops!" content={error} />
        <Button primary disabled={loading} loading={loading}>Create campaign</Button>
        {!!loading && <Message content="We are creating your campaign, this might take a while, you will be redirected to the campaign list after its done." />}
      </Form>
    </div>
  );
};

NewCampaign.defaultProps = {};

export default NewCampaign;