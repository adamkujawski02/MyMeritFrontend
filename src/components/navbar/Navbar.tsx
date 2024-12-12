import { Fragment } from "react";
import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  DisclosurePanel,
  DisclosureButton,
  Transition,
} from "@headlessui/react";
import MyMeritLogo from "../../assets/mymerit_logo.png";
import { useAuth } from "../../hooks/useAuth";
import { faCircleUser, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { isAuthenticated, userData, signOut, isAuthenticatedCompany } =
    useAuth();

  const location = useLocation();

  const navigation = [
    {
      name: "Offers",
      href: "/jobs",
      current: location.pathname == "/jobs",
      protected: false,
    },
    {
      name: "Leaderboard",
      href: "/leaderboard",
      current: location.pathname == "/leaderboard",
      protected: false,
    },
    {
      name: "Rewards",
      href: "/rewards",
      current: location.pathname == "/rewards",
      protected: true,
    },
    {
      name: "CodeWars",
      href: "/sk",
      current: location.pathname == "/sk",
      protected: true,
    },
  ];

  return (
    <Disclosure as="nav" className="z-10 bg-secondary-bg-color shadow-md">
      {({ open }) => (
        <>
          <div className="mx-auto w-full xl:max-w-[1200px] 2xl:max-w-[1400px] px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <DisclosureButton className="relative inline-flex items-center justify-center rounded-md text-gray-400 focus:outline-none">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <div className="grid w-8 justify-items-center gap-1.5">
                    <span
                      className={`h-1 w-full rounded-full bg-white transition ${
                        open ? "rotate-45 translate-y-2.5" : ""
                      }`}
                    ></span>
                    <span
                      className={`h-1 w-full rounded-full bg-white transition ${
                        open ? "scale-x-0" : ""
                      }`}
                    ></span>
                    <span
                      className={`h-1 w-full rounded-full bg-white transition ${
                        open ? "-rotate-45 -translate-y-2.5" : ""
                      }`}
                    ></span>
                  </div>
                </DisclosureButton>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/">
                    <img
                      className="h-8 w-auto"
                      src={MyMeritLogo}
                      alt="MyMerit Logo"
                    />
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => {
                      if (item.protected && !isAuthenticated()) return null;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            item.current
                              ? "bg-main-bg-color text-white"
                              : "text-gray-300 hover:bg-main-bg-color hover:text-white",
                            "rounded-md px-3 py-2 text-base font-medium transition-colors duration-100 ease-linear"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:ml-6">
                {isAuthenticatedCompany() && (
                  <Link
                    to="/job/new"
                    className={classNames(
                      "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-100 ease-linear bg-success-color hover:bg-success-darker-color text-white"
                    )}
                  >
                    <div className="flex flex-row gap-2 items-center justify-center">
                      <FontAwesomeIcon icon={faPlus} />
                      <span className="hidden sm:block">New job offer</span>
                    </div>
                  </Link>
                )}
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative w-8 h-8 flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      {userData?.imageBase64 ? (
                        <img
                          src={userData.imageBase64}
                          alt="avatar"
                          className="w-full h-full rounded-full"
                        />
                      ) : (
                        <FontAwesomeIcon
                          className="w-full h-full"
                          icon={faCircleUser}
                        />
                      )}
                    </MenuButton>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md text-white bg-secondary-bg-color border-main-bg-color border-[1px] border-solid p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {isAuthenticated() && (
                        <>
                          <MenuItem>
                            <Link
                              to="/me"
                              className={classNames(
                                "block px-4 py-2 text-sm hover:bg-main-bg-color rounded transition-colors duration-100 ease-linear"
                              )}
                            >
                              Your Profile
                            </Link>
                          </MenuItem>
                        </>
                      )}

                      <MenuItem>
                        {isAuthenticated() ? (
                          <button
                            onClick={() => signOut()}
                            className={classNames(
                              "text-left w-full block px-4 py-2 text-sm hover:bg-main-bg-color rounded transition-colors duration-100 ease-linear"
                            )}
                          >
                            Sign out
                          </button>
                        ) : (
                          <Link
                            to="/login"
                            className={classNames(
                              "block px-4 py-2 text-sm hover:bg-main-bg-color rounded transition-colors duration-100 ease-linear"
                            )}
                          >
                            Sign in
                          </Link>
                        )}
                      </MenuItem>
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => {
                if (item.protected && !isAuthenticated()) return null;
                return (
                  <DisclosureButton
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-main-bg-color text-white"
                        : "text-gray-300 hover:bg-main-bg-color hover:text-white",
                      "rounded-md px-3 py-2 text-base font-medium transition-colors duration-100 ease-linear block"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </DisclosureButton>
                );
              })}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
