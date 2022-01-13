import {Button, Table} from "semantic-ui-react";
import {useRouter} from "next/router";
import web3 from "../../../../ethereum/web3";
import Campaign from "../../../../ethereum/campaign";
import {add} from "lodash/math";

export async function getServerSideProps(context) {
  const {address} = context.query;
  const campaign = Campaign(address);

  const requestsCount = await campaign.methods.getRequestsCount().call();
  const approversCount = await campaign.methods.approversCount().call();

  let requests = await Promise.all(
    Array(Number(requestsCount))
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call();
      })
  );

  requests = Array(Object.keys(requests).length).fill().map((item, index) => {
    return ({
      description: requests[index].description,
      value: web3.utils.fromWei(requests[index].value, "ether"),
      recipient: requests[index].recipient,
      complete: requests[index].complete,
      approvalCount: Number(requests[index].approvalCount),
    });
  });

  return {props: {address, requests, requestsCount, approversCount}}
}

const CampaignRequests = ({address, requests, requestsCount, approversCount}) => {
  const router = useRouter();

  const onAddRequest = () => {
    router.push(`/campaigns/${address}/requests/new`);
  }

  const onApprove = (requestIndex) => async () => {
    const campaign = Campaign(address);

    const accounts = await web3.eth.getAccounts();
    await campaign.methods.approveRequest(requestIndex).send({
      from: accounts[0]
    })
  }

  const onFinalize = (requestIndex) => async () => {
    const campaign = Campaign(address);

    const accounts = await web3.eth.getAccounts();
    await campaign.methods.finalizeRequest(requestIndex).send({
      from: accounts[0]
    })
  }

  return (
    <div>
      <Button primary onClick={onAddRequest}>Add request</Button>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Recipient</Table.HeaderCell>
            <Table.HeaderCell>Approval Count</Table.HeaderCell>
            <Table.HeaderCell>Approve</Table.HeaderCell>
            <Table.HeaderCell>Finalize</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {requests.map((req, index) => {
            const readyToFinalize = req.approvalCount > approversCount / 2;

            return (
              <Table.Row key={req.description} disabled={req.complete} positive={readyToFinalize && !req.complete}>
                <Table.Cell>{index}</Table.Cell>
                <Table.Cell>{req.description}</Table.Cell>
                <Table.Cell>{req.value} ETH</Table.Cell>
                <Table.Cell>{req.recipient}</Table.Cell>
                <Table.Cell>{req.approvalCount}/{approversCount}</Table.Cell>
                <Table.Cell>{req.complete ? null :
                  <Button color="green" onClick={onApprove(index)}>Approve</Button>}</Table.Cell>
                <Table.Cell>{req.complete ? "Finalized" :
                  <Button color="orange" onClick={onFinalize(index)}>Finalize</Button>}</Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
      <div>{`Found ${requestsCount} requests`}</div>
    </div>
  );
};

CampaignRequests.defaultProps = {};


export default CampaignRequests;