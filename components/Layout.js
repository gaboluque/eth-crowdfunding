import {Container, Icon, Menu, MenuItem} from "semantic-ui-react";
import {Header} from "./Header";

export const Layout = ({ children }) => {

  return (
    <div className="layout">
      <Header />
      <Container>
        {children}
      </Container>
    </div>
  )
}