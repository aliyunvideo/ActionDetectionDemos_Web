import logoUrl from './assets/logo.png';

function Header() {
  return (
    <nav className='hd'>
      <div className='_inner'>
        <img src={logoUrl} alt='Logo' />
        <span>远程监考智能防作弊</span>
      </div>
    </nav>
  );
}

export default Header;
