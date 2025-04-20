import React from "react";
import Link from "next/link";
import { Menu, User } from "lucide-react";

const Navbar: React.FC = () => {
  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <Menu />
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/store">Marketplace</Link>
            </li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          BlockBay
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/store">Marketplace</Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end">
        <User />
      </div>
    </div>
  );
};

export default Navbar;
