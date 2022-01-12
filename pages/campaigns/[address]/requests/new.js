import {useRouter} from "next/router";
import {Button, Form, Input, Message} from "semantic-ui-react";
import {useState} from "react";
import Campaign from '../../../../ethereum/campaign';
import web3 from "../../../../ethereum/web3";

export async function getServerSideProps(context) {
  const {address} = context.query;

  return {props: {address}}
}

const NewRequestPage = ({address}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    description: "",
    value: "",
    recipient: ""
  });

  const changeItem = (name) => ({target}) => {
    setForm({...form, [name]: target.value});
  }

  const onSubmit = async () => {
    const campaign = Campaign(address);
    const {description, value, recipient} = form;

    try {
      setLoading(true);
      setError("");
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({from: accounts[0]});

      router.push(`/campaigns/${address}/requests`);

    } catch (err) {
      setError(err.message);
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3>Create request</h3>
      <Form onSubmit={onSubmit} error={!!error}>
        <Form.Field>
          <label htmlFor="description">Description</label>
          <Input id="description" value={form["description"]} onChange={changeItem("description")}/>
        </Form.Field>
        <Form.Field>
          <label htmlFor="value">Value in Ether</label>
          <Input type="number" id="value" value={form["value"]} onChange={changeItem("value")}/>
        </Form.Field>
        <Form.Field>
          <label htmlFor="recipient">Recipient</label>
          <Input id="recipient" value={form["recipient"]} onChange={changeItem("recipient")}/>
        </Form.Field>
        <Message error header="Oops!" content={error}/>
        <Button loading={loading} primary>Create request!</Button>
        {loading && <Message
          content="We are processing your request! This might take a while."/>}
      </Form>
    </div>
  );
};

NewRequestPage.defaultProps = {};


export default NewRequestPage;