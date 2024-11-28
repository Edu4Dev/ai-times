import React from "react";
const MainMenuList = ({
  list,
  indx,
  isMobile,
  handleRefState,
  userIcon,
  refState,
  hanburguerIcon,
  pathname,
}) => {
  if (list.href && isMobile !== true) {
    return (
      <li key={indx} role='presentation'>
        <a
          href={list.href}
          role={"menuitem"}
          itemProp='url'
          title={list.label}
          aria-label={`Acesso a página: ${list.label}, fora do websítio da EMPRESA`}
          alt={`Acesso a página: ${list.label}, fora do websítio da EMPRESA`}
        >
          {list.label}
        </a>
      </li>
    );
  }
  // if ((list.to || list.anchor) && isMobile !== true) {
  //   let anchorHash = null;
  //   let label = null;
  //   const anchor = list??.anchor?.split(",");
  //   anchor?.forEach(w => {
  //     const x = w.split(":");
  //     if (x[0] === pathname) {
  //       return (anchorHash = x[0] === pathname ? x[1] : null);
  //     }

  //     return null;
  //   });
  //   const labelString = list??.label?.split(",");
  //   labelString?.forEach(l => {
  //     const lb = l.split(":");
  //     if (lb[0] === pathname) {
  //       label = lb[1];
  //       return label;
  //     }
  //     return null;
  //   });
  //   return (
  //     <li key={indx} role='presentation'>
  //       <Link
  //         href={list.anchor ? pathname + "/" + anchorHash : list.to}
  //         role={"menuitem"}
  //         itemProp='url'
  //         title={list.label}
  //         aria-label={`Acesso a página: ${list.label}, no websítio da EMPRESA`}
  //         alt={`Acesso a página: ${list.label}, no websítio da EMPRESA`}
  //         className='none'
  //         onClick={handleRefState}
  //       >
  //         {list.anchor ? label : list.label}
  //       </Link>
  //     </li>
  //   );
  // }
  if (isMobile === true) {
    return (
      <div className='header-columns toggle-menu'>
        <p className='menu-shop-bag-mobile'>{userIcon}</p>
        <p className='menu-shop-bag-mobile' tabIndex='-1'></p>
        <button
          type='button'
          id='check-toggle-icon'
          onClick={handleRefState}
          aria-haspopup='true'
          aria-controls='mainmenu'
          aria-expanded={refState}
          aria-label='Alternar visibilidade do menu'
          className={`menu-wrapper menu-bar-icon  ${
            refState ? "active" : "not-active"
          }`}
        >
          {hanburguerIcon}
        </button>
      </div>
    );
  }
  return null;
};
export default MainMenuList;
