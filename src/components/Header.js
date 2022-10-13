import { Link, useLocation } from 'react-router-dom';
import logo from '../images/logo.svg';

function Header({ isLoggedIn }) {
  const location = useLocation();
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип" />
      <nav className="header__nav">
        {
          isLoggedIn 
          ? (
            <>
              <span className="header__email">email@yandex.ru</span>
              <button className="header__button">Выйти</button>
            </>
            ) 
          : location.pathname.includes('sign-in') 
            ? <Link className="header__link" to="/sign-up">Регистрация</Link>
            : <Link className="header__link" to="/sign-in">Войти</Link>
        }
      </nav>
    </header>
  )
}

export default Header;