import { Menu } from "semantic-ui-react";

export const Header = () => {
  return (
    <Menu>
      <Menu.Item name="logo">
        CrowdCoin
      </Menu.Item>

      <Menu.Menu position="right">
        <Menu.Item name="campaigns">
          Campaigns
        </Menu.Item>
        <Menu.Item name="plus">+</Menu.Item>
      </Menu.Menu>
    </Menu>
  )
}