import { Menu } from "semantic-ui-react";
import {useRouter} from "next/router";

export const Header = () => {
  const router = useRouter();

  const onMenuClick = (path) => () => {
    router.push(path);
  }

  return (
    <Menu>
      <Menu.Item name="logo">
        CrowdCoin
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item name="campaigns" onClick={onMenuClick("/")}>
          Campaigns
        </Menu.Item>
        <Menu.Item name="plus" onClick={onMenuClick("/campaigns/new")}>+</Menu.Item>
      </Menu.Menu>
    </Menu>
  )
}