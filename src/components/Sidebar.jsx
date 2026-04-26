import React, { useState } from 'react'
import { useSelector } from "react-redux";
import { Link, NavLink } from 'react-router-dom'
import { MdOutlineCancel, MdKeyboardArrowDown } from 'react-icons/md'
import { FaUser, FaProjectDiagram, FaTools, FaCertificate, FaBriefcase, FaGraduationCap, FaUsers, FaHeart, FaChild, FaLock } from 'react-icons/fa';
import { BiSolidDashboard } from 'react-icons/bi';

import { useStateContext } from '../contexts/ContextProvider'

const Sidebar = () => {
  const { activeMenu, setActiveMenu, screenSize, currentColor, currentMode } = useStateContext()
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role || 'siswa';
  const [openSubMenu, setOpenSubMenu] = useState('');

  // Portfolio themed links configuration
  const allLinks = [
    {
      title: 'Dashboard',
      links: [
        {
          name: 'dashboard',
          displayName: 'Dashboard',
          icon: <BiSolidDashboard />,
          allowedRoles: ['admin']
        },
      ],
    },
  
    {
      title: 'Data Pegawai',
      links: [
        {
          name: 'filter',
          displayName: 'Filter',
          icon: <FaUser />,
          allowedRoles: ['admin']
        },
        {
          name: 'pegawai',
          displayName: 'Pegawai',
          icon: <FaUser />,
          allowedRoles: ['admin']
        },
        {
          name: 'kepegawaian',
          displayName: 'Kepegawaian',
          icon: <FaProjectDiagram />,
          allowedRoles: ['admin']
        },
        {
          name: 'pangkat',
          displayName: 'Pangkat',
          icon: <FaTools />,
          allowedRoles: ['admin']
        },
        {
          name: 'alamat',
          displayName: 'Alamat',
          icon: <FaCertificate />,
          allowedRoles: ['admin']
        },
        {
          name: 'identitas',
          displayName: 'Identitas',
          icon: <FaBriefcase />,
          allowedRoles: ['admin']
        },
        {
          name: 'rekening',
          displayName: 'Rekening',
          icon: <FaGraduationCap />,
          allowedRoles: ['admin']
        },
        {
          name: 'pendidikan',
          displayName: 'Pendidikan',
          icon: <FaUsers />,
          allowedRoles: ['admin']
        },
        {
          name: 'fisik',
          displayName: 'Fisik',
          icon: <FaUsers />,
          allowedRoles: ['admin']
        },
        {
          name: 'ukuran',
          displayName: 'Ukuran Dinas',
          icon: <FaUsers />,
          allowedRoles: ['admin']
        },
        {
          name: 'keluarga',
          displayName: 'Keluarga',
          icon: <FaUsers />,
          allowedRoles: ['admin'],
          subLinks: [
            {
              name: 'pasangan',
              displayName: 'Pasangan',
              icon: <FaHeart />,
              allowedRoles: ['admin']
            },
            {
              name: 'anak',
              displayName: 'Anak',
              icon: <FaChild />,
              allowedRoles: ['admin']
            },
          ]
        },
      ],
    },
    {
      title: 'System',
      links: [
        {
          name: 'change-password',
          displayName: 'Change Password',
          icon: <FaLock />,
          allowedRoles: ['admin']
        },
      ],
    },
  ];

  // Filter links based on user role
  const filterLinksByRole = (links, role) => {
    const filteredCategories = links.map(category => {
      const filteredLinks = category.links
        .map(link => {
          if (link.subLinks) {
            const filteredSubLinks = link.subLinks.filter(subLink =>
              subLink.allowedRoles.includes(role)
            );
            return filteredSubLinks.length
              ? { ...link, subLinks: filteredSubLinks }
              : null;
          }

          return link.allowedRoles.includes(role) ? link : null;
        })
        .filter(Boolean);

      return {
        ...category,
        links: filteredLinks
      };
    });

    return filteredCategories.filter(category => category.links.length > 0);
  };

  const links = filterLinksByRole(allLinks, userRole);

  const handleCloseSideBar = () => {
    if(activeMenu && screenSize <= 900){
      setActiveMenu(false)
    }
  }

  const isDark = currentMode === 'Dark';

  // Dynamic link styles
  const activeLink = `flex items-center gap-3 pl-4 pt-3 pb-3 rounded-lg text-white text-sm m-2 font-medium transition-all duration-300`;
  
  const normalLink = `flex items-center gap-3 pl-4 pt-3 pb-3 rounded-lg text-sm m-2 transition-all duration-300 ${
    isDark 
      ? 'text-gray-300 hover:bg-gray-700' 
      : 'text-gray-700 hover:bg-gray-100'
  }`;

  return (
    <div 
      className={`ml-3 h-screen relative overflow-hidden ${
        isDark ? 'bg-[#040c24]' : 'bg-white'
      }`}
      style={{ 
        borderRight: `1px solid ${isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.08)'}` 
      }}
    >

      {/* Content Wrapper */}
      <div className="relative z-10 h-screen overflow-y-auto overflow-x-hidden md:hover:overflow-y-auto pb-10">
        {activeMenu && (<>
          {/* Header Section */}
        <div 
          className={`flex justify-between items-center pb-4 border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <Link 
            to="/dashboard" 
            onClick={handleCloseSideBar} 
            className={`items-center gap-3 ml-3 mt-4 flex text-lg font-bold tracking-tight transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}
          >
            <div>
              <span style={{ color: currentColor }}>SIPBOT</span>
              <span> <span style={{ color: "#FDB927" }}>IMIGRASI</span></span>
            </div>
          </Link>
          
          <button 
            type='button' 
            onClick={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)} 
            className={`text-xl rounded-lg p-2 mt-4 mr-3 block md:hidden transition-colors duration-300 ${
              isDark 
                ? 'text-gray-300 hover:bg-gray-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MdOutlineCancel />
          </button>
        </div>

          {/* Navigation Links */}
          <div className='mt-6 px-3 space-y-8'>
            {links.map((item) => (
              <div key={item.title} className="space-y-2">
                {/* Section Header */}
                <p 
                  className={`text-[10px] font-bold uppercase tracking-widest px-3 ${
                    isDark ? 'text-gray-600' : 'text-gray-500'
                  }`}
                >
                  {item.title}
                </p>
                
                {/* Navigation Items */}
                <div className="space-y-1">
                  {item.links.map((link) => (
                    link.subLinks ? (
                      <div key={link.name} className="space-y-1">
                        <button
                          type="button"
                          onClick={() => setOpenSubMenu(prev => prev === link.name ? '' : link.name)}
                          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden group ${
                            isDark
                              ? 'text-gray-400 hover:text-gray-200'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <span className="text-base flex-shrink-0">{link.icon}</span>
                          <span className='flex-1 text-left'>{link.displayName}</span>
                          <MdKeyboardArrowDown
                            className={`transition-transform duration-200 ${openSubMenu === link.name ? 'rotate-180' : ''}`}
                          />
                        </button>

                        {openSubMenu === link.name && (
                          <div className="space-y-1 pl-6">
                            {link.subLinks.map((subLink) => (
                              <NavLink
                                to={`/${subLink.name}`}
                                key={subLink.name}
                                onClick={handleCloseSideBar}
                                className={({ isActive }) => {
                                  const baseStyle = `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden group`;
                                  if (isActive) {
                                    return `${baseStyle} text-white`;
                                  }
                                  return `${baseStyle} ${
                                    isDark
                                      ? 'text-gray-400 hover:text-gray-200'
                                      : 'text-gray-600 hover:text-gray-900'
                                  }`;
                                }}
                                style={({ isActive }) =>
                                  isActive
                                    ? {
                                        backgroundColor: currentColor,
                                        boxShadow: `0 4px 12px ${currentColor}40`
                                      }
                                    : {}
                                }
                              >
                                <div
                                  className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10 ${
                                    isDark ? 'bg-gray-800' : 'bg-gray-100'
                                  }`}
                                />
                                <span className="text-base flex-shrink-0">{subLink.icon}</span>
                                <span className='flex-1'>{subLink.displayName}</span>
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <NavLink 
                        to={`/${link.name}`} 
                        key={link.name} 
                        onClick={handleCloseSideBar} 
                        className={({ isActive }) => {
                          const baseStyle = `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden group`;
                          
                          if (isActive) {
                            return `${baseStyle} text-white`;
                          }
                          
                          return `${baseStyle} ${
                            isDark 
                              ? 'text-gray-400 hover:text-gray-200' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`;
                        }}
                        style={({ isActive }) => 
                          isActive 
                            ? { 
                                backgroundColor: currentColor,
                                boxShadow: `0 4px 12px ${currentColor}40`
                              }
                            : {}
                        }
                      >
                        {/* Background glow on hover */}
                        <div
                          className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10 ${
                            isDark ? 'bg-gray-800' : 'bg-gray-100'
                          }`}
                        />
                        
                        <span className="text-base flex-shrink-0">{link.icon}</span>
                        <span className='flex-1'>{link.displayName}</span>
                        
                        {/* Active indicator */}
                        <div 
                          className="absolute right-0 top-0 bottom-0 w-1 rounded-full transition-all duration-200"
                          style={{
                            background: 'currentColor',
                            opacity: 0
                          }}
                        />
                      </NavLink>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Decorative Element */}
          <div className="absolute bottom-6 left-0 right-0 px-4">
            <div className="relative">
              {/* Decorative grid at bottom */}
              <div 
                className="grid grid-cols-6 gap-2 opacity-30 pointer-events-none"
              >
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={`sidebar-grid-${i}`} 
                    className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    style={{ backgroundColor: currentColor }}
                  />
                ))}
              </div>
            </div>
          </div>
        </>)}
      </div>
    </div>
  )
}

export default Sidebar