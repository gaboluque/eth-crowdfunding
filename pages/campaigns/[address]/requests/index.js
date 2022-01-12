import {Button, Table} from "semantic-ui-react";
import {useRouter} from "next/router";
import Campaign from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";

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
          {requests.map((req, index) => (
            <Table.Row key={req.description}>
              <Table.Cell>{index}</Table.Cell>
              <Table.Cell>{req.description}</Table.Cell>
              <Table.Cell>{req.value} ETH</Table.Cell>
              <Table.Cell>{req.recipient}</Table.Cell>
              <Table.Cell>{req.approvalCount}/{approversCount}</Table.Cell>
              <Table.Cell><Button primary>Approve</Button></Table.Cell>
              <Table.Cell><Button>Finalize</Button></Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

CampaignRequests.defaultProps = {};


export default CampaignRequests;