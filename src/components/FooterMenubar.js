import React from "react";
import { Link } from "react-router-dom";
import "../shared/App.css";


class FooterMenubar extends React.Component {
  render() {
    return (
      <nav id="footer-menubar1" style={{ width: "0px" }}>
        <ul>
          <li className="menuLink1">
            <Link className="menuLink" to="/info">
              미공개
            </Link>
          </li>
          <li className="menuLink2">
            <Link className="menuLink" to="/info">
              미공개
            </Link>
          </li>
          <li className="menuLink3">
            <Link className="menuLink" to="/main">
              홈
            </Link>
          </li>
          <li className="menuLink4">
            <Link className="menuLink" to="/selectGenre">
              만들기
            </Link>
          </li>
          <li className="menuLink5">
            {!this.props.email ? (
              <Link className="menuLink" to="/login">
                로그인
              </Link>
            ) : (
              <Link className="menuLink" to="/profile">
                프로필
              </Link>
            )}
          </li>
        </ul>
      </nav>
    );
  }
}
export default FooterMenubar;
